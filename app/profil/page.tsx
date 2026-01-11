import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { Category } from "@prisma/client";

function label(cat: Category) {
  if (cat === "EMAIL") return "Email";
  if (cat === "SMS") return "SMS";
  return "Réseaux sociaux";
}

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      username: true,
      email: true,
      attempts: {
        select: {
          category: true,
          score: true,
          total: true,
          completed: true,
          _count: { select: { answers: true } },
        },
      },
      badges: {
        select: {
          earnedAt: true,
          badge: { select: { code: true, name: true, desc: true } },
        },
        orderBy: { earnedAt: "desc" },
      },
    },
  });

  if (!user) redirect("/login");

  // normaliser attempts par catégorie
  const byCat: Record<string, { answered: number; total: number; score: number; completed: boolean }> =
    {
      EMAIL: { answered: 0, total: 10, score: 0, completed: false },
      SMS: { answered: 0, total: 10, score: 0, completed: false },
      SOCIAL: { answered: 0, total: 10, score: 0, completed: false },
    };

  for (const a of user.attempts) {
    byCat[a.category] = {
      answered: a._count.answers,
      total: a.total || 10,
      score: a.score,
      completed: a.completed,
    };
  }

  const totalAnswered =
    byCat.EMAIL.answered + byCat.SMS.answered + byCat.SOCIAL.answered;
  const totalQuestions = byCat.EMAIL.total + byCat.SMS.total + byCat.SOCIAL.total;

  const totalScore = byCat.EMAIL.score + byCat.SMS.score + byCat.SOCIAL.score;

  const progressPct = totalQuestions ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profil</h1>
          <p className="mt-2 text-slate-600">
            Connecté en tant que <span className="font-semibold text-slate-900">{user.username}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Paramètres du compte
          </Link>
          <Link
            href="/categories"
            className="rounded-full border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continuer
          </Link>
        </div>
      </div>

      {/* Global progression */}
      <section className="mt-10 rounded-3xl border bg-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Progression globale</h2>
            <p className="mt-2 text-sm text-slate-600">
              Questions répondues : {totalAnswered}/{totalQuestions} • Score : {totalScore}/{totalQuestions}
            </p>
          </div>
          <p className="text-3xl font-bold text-slate-900">{progressPct}%</p>
        </div>

        <div className="mt-4 h-3 w-full rounded-full bg-slate-100">
          <div
            className="h-3 rounded-full bg-slate-900"
            style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
          />
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {/* Progress per category */}
        <section className="rounded-3xl border bg-white p-6 md:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Par catégorie</h2>

          <div className="mt-4 space-y-4">
            {(["EMAIL", "SMS", "SOCIAL"] as Category[]).map((cat) => {
              const a = byCat[cat];
              const pct = a.total ? Math.round((a.answered / a.total) * 100) : 0;

              return (
                <div key={cat} className="rounded-2xl border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{label(cat)}</p>
                    <p className="text-sm text-slate-700">
                      {a.answered}/{a.total} • Score {a.score}/{a.total}
                    </p>
                  </div>

                  <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-slate-900"
                      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{pct}%</span>
                    <Link
                      href={`/scenarios/${cat}`}
                      className="text-sm font-semibold text-slate-900 hover:underline"
                    >
                      Continuer →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Badges */}
        <section className="rounded-3xl border bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Badges</h2>
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-xs text-slate-700">
              {user.badges.length}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {user.badges.length === 0 ? (
              <p className="text-sm text-slate-600">
                Aucun badge pour l’instant. Termine une catégorie !
              </p>
            ) : (
              user.badges.map((b) => (
                <div key={b.badge.code} className="rounded-2xl border p-4">
                  <p className="font-semibold text-slate-900">{b.badge.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{b.badge.desc}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Obtenu le {new Date(b.earnedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}