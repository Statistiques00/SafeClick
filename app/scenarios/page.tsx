import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

function label(cat: Category) {
  if (cat === "EMAIL") return "Email";
  if (cat === "SMS") return "SMS";
  return "Réseaux sociaux";
}

function desc(cat: Category) {
  if (cat === "EMAIL") return "Phishing, fausses factures, pièces jointes.";
  if (cat === "SMS") return "Livraisons, banques, urgences, liens courts.";
  return "Faux concours, DM, usurpations, pubs.";
}

export default async function ScenariosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  // Récupère la progression depuis la DB (server-side, plus simple)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });
  if (!user) redirect("/login");

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

  const byCat: Record<string, { answered: number; total: number; score: number; completed: boolean }> =
    {
      EMAIL: { answered: 0, total: 10, score: 0, completed: false },
      SMS: { answered: 0, total: 10, score: 0, completed: false },
      SOCIAL: { answered: 0, total: 10, score: 0, completed: false },
    };

  for (const a of attempts) {
    byCat[a.category] = {
      answered: a._count.answers,
      total: a.total ?? 10,
      score: a.score,
      completed: a.completed,
    };
  }

  const categories: Category[] = ["EMAIL", "SMS", "SOCIAL"];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-4xl font-bold text-slate-900">Scénarios</h1>
      <p className="mt-3 text-slate-600">
        Lance un quiz et entraîne-toi à repérer les signaux d’arnaque.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {categories.map((cat) => {
          const a = byCat[cat];
          const pct = a.total ? Math.round((a.answered / a.total) * 100) : 0;
          const cta = a.answered === 0 ? "Commencer" : a.completed ? "Rejouer" : "Continuer";

          return (
            <div key={cat} className="rounded-3xl border bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{label(cat)}</p>
                  <p className="mt-2 text-sm text-slate-600">{desc(cat)}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  10 questions
                </span>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">Progression</p>
                  <p className="text-xs font-semibold text-slate-700">{pct}%</p>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-slate-900"
                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                  />
                </div>

                <p className="mt-3 text-sm text-slate-700">
                  {a.answered}/{a.total} • Score {a.score}/{a.total}
                  {a.completed ? " • Terminé ✅" : ""}
                </p>
              </div>

              {/* CTA */}
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href={`/scenarios/${cat}`}
                  className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  {cta}
                </Link>
                <Link
                  href="/profil"
                  className="rounded-full border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  Voir profil
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Petit bloc "Voir progression" comme sur ton mock */}
      <div className="mt-10 rounded-3xl border bg-white p-6">
        <p className="text-slate-600">
          Ta progression est sauvegardée automatiquement et visible dans ton profil.
        </p>
        <Link
          href="/profil"
          className="mt-4 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          Voir ma progression
        </Link>
      </div>
    </main>
  );
}
