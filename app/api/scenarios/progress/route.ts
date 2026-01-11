import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User introuvable" }, { status: 404 });
  }

  const attempts = await prisma.attempt.findMany({
    where: { userId: user.id },
    select: {
      category: true,
      score: true,
      total: true,
      completed: true,
      _count: { select: { answers: true } },
    },
  });

  return NextResponse.json({
    attempts: attempts.map((a) => ({
      category: a.category,
      score: a.score,
      total: a.total ?? 10,
      answered: a._count.answers,
      completed: a.completed,
    })),
  });
}