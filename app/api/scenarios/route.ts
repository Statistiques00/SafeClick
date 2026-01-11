import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as Category | null;

  if (!category || !Object.values(Category).includes(category)) {
    return NextResponse.json({ error: "Catégorie invalide" }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { category },
    include: { options: { select: { id: true, label: true } } },
    orderBy: { id: "asc" },
    take: 10,
  });

  return NextResponse.json({ questions });
}
