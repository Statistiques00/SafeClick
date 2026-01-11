import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Category } from "@prisma/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json()) as {
    category: Category;
    questionId: string;
    optionId: string;
  };

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) return NextResponse.json({ error: "User introuvable" }, { status: 404 });

  const question = await prisma.question.findUnique({
    where: { id: body.questionId },
    include: { options: true },
  });
  if (!question || question.category !== body.category) {
    return NextResponse.json({ error: "Question invalide" }, { status: 400 });
  }

  const picked = question.options.find(o => o.id === body.optionId);
  if (!picked) return NextResponse.json({ error: "Option invalide" }, { status: 400 });

  const isCorrect = !!picked.isCorrect;

  // upsert attempt catégorie
  const attempt = await prisma.attempt.upsert({
    where: { userId_category: { userId: user.id, category: body.category } },
    update: {},
    create: { userId: user.id, category: body.category, total: 10 },
    select: { id: true },
  });

  // enregistre / remplace la réponse
  await prisma.answer.upsert({
    where: { attemptId_questionId: { attemptId: attempt.id, questionId: question.id } },
    update: { optionId: picked.id, isCorrect },
    create: { attemptId: attempt.id, questionId: question.id, optionId: picked.id, isCorrect },
  });

  // recalcul score + completed
  const answers = await prisma.answer.findMany({
    where: { attemptId: attempt.id },
    select: { isCorrect: true },
  });

  const score = answers.filter(a => a.isCorrect).length;
  const completed = answers.length >= 10;

  await prisma.attempt.update({
    where: { id: attempt.id },
    data: { score, completed, total: 10 },
  });

  // badges simple
  if (completed) {
    const badge = await prisma.badge.findUnique({ where: { code: "FIRST_CATEGORY" } });
    if (badge) {
      await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId: user.id, badgeId: badge.id } },
        update: {},
        create: { userId: user.id, badgeId: badge.id },
      });
    }

    // si les 3 catégories sont completed -> badge ALL_CATEGORIES
    const done = await prisma.attempt.count({
      where: { userId: user.id, completed: true },
    });
    if (done >= 3) {
      const all = await prisma.badge.findUnique({ where: { code: "ALL_CATEGORIES" } });
      if (all) {
        await prisma.userBadge.upsert({
          where: { userId_badgeId: { userId: user.id, badgeId: all.id } },
          update: {},
          create: { userId: user.id, badgeId: all.id },
        });
      }
    }
  }

  return NextResponse.json({
    ok: true,
    isCorrect,
    score,
    answered: answers.length,
    completed,
    explanation: question.explanation,
  });
}