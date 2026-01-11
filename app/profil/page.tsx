import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // ✅ Données mock (tu pourras brancher Prisma plus tard)
  const progression = 32; // %
  const badges = [
    { id: "b1", name: "Débutant", desc: "Compte créé", earned: true },
    { id: "b2", name: "Anti-phishing", desc: "1er scénario réussi", earned: true },
    { id: "b3", name: "Vigilant", desc: "5 bonnes réponses d'affilée", earned: false },
    { id: "b4", name: "Expert", desc: "Terminer un parcours", earned: false },
  ];

  const username =
    (session.user.name && session.user.name.toString().trim()) ||
    (session.user.email?.split("@")[0] ?? "Utilisateur");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Profil</h1>
          <p className="mt-2 text-slate-600">
            Bonjour <span className="font-semibold text-slate-900">{username}</span>
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
            href="/scenarios"
            className="rounded-full border bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Continuer les scénarios
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {/* Progression */}
        <section className="rounded-3xl border bg-white p-6 md:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Progression</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ton avancée globale sur SafeClick.
          </p>

          <div className="mt-6">
            <div className="flex items-end justify-between">
              <p className="text-sm font-medium text-slate-700">Total</p>
              <p className="text-2xl font-bold text-slate-900">{progression}%</p>
            </div>

            <div className="mt-3 h-3 w-full rounded-full bg-slate-100">
              <div
                className="h-3 rounded-full bg-slate-900"
                style={{ width: `${Math.min(100, Math.max(0, progression))}%` }}
                aria-label={`Progression ${progression}%`}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniStat title="Scénarios" value="2/10" />
              <MiniStat title="Parcours" value="0/3" />
              <MiniStat title="Bonnes réponses" value="18" />
              <MiniStat title="Série max" value="5" />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="rounded-3xl border bg-white p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Badges</h2>
              <p className="mt-2 text-sm text-slate-600">
                Débloque des badges en progressant.
              </p>
            </div>
            <span className="rounded-full border bg-slate-50 px-3 py-1 text-sm text-slate-700">
              {badges.filter((b) => b.earned).length}/{badges.length} obtenus
            </span>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {badges.map((b) => (
              <BadgeCard
                key={b.id}
                name={b.name}
                desc={b.desc}
                earned={b.earned}
              />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Astuce : termine un scénario pour débloquer ton prochain badge.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function BadgeCard({
  name,
  desc,
  earned,
}: {
  name: string;
  desc: string;
  earned: boolean;
}) {
  return (
    <div className="rounded-3xl border p-5">
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold",
            earned ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500",
          ].join(" ")}
          aria-hidden
        >
          {earned ? "✓" : "•"}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="mt-1 text-sm text-slate-600">{desc}</p>

          <p
            className={[
              "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
              earned
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-50 text-slate-600",
            ].join(" ")}
          >
            {earned ? "Obtenu" : "À débloquer"}
          </p>
        </div>
      </div>
    </div>
  );
}
