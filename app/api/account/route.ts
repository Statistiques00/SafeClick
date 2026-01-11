import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, createdAt: true },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const body = (await req.json()) as {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const email = body.email?.trim().toLowerCase();
  const currentPassword = body.currentPassword;
  const newPassword = body.newPassword;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // 1) Update email (optionnel)
  if (email && email !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { email },
    });
  }

  // 2) Update password (optionnel)
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json(
        { error: "Mot de passe actuel requis" },
        { status: 400 }
      );
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return NextResponse.json(
        { error: "Mot de passe actuel incorrect" },
        { status: 401 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Le nouveau mot de passe doit faire au moins 6 caractères" },
        { status: 400 }
      );
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: newHash },
    });
  }

  return NextResponse.json({ ok: true });
}