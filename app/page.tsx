import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-8">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm text-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Entraînement anti-phishing • Scénarios réalistes • Progression
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          Apprends à repérer les arnaques avant{" "}
          <span className="text-slate-400">qu’elles ne te piègent.</span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
          SafeClick te propose des scénarios (email, SMS, réseaux sociaux) pour
          t’entraîner à identifier les signaux d’alerte : urgence, usurpation,
          liens douteux, pièces jointes, etc. Le tout avec un suivi de
          progression.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/scenarios"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Commencer
          </Link>

          <Link
            href="/scenarios"
            className="inline-flex items-center justify-center rounded-full border bg-white px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            Voir les scénarios
          </Link>

          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Parcours d’apprentissage <span aria-hidden>→</span>
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-10 rounded-3xl border bg-slate-50 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat title="Catégories" value="Email • SMS • Réseaux" />
            <MiniStat title="Objectif" value="Réflexes & vigilance" />
            <MiniStat title="Progression" value="Points • niveaux • badges" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Comment ça fonctionne
        </h2>
        <p className="mt-2 text-slate-600">
          Une boucle simple : tu observes → tu décides → tu reçois un feedback →
          tu progresses.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <HowCard
            title="1. Scénarios réalistes"
            desc="Des messages inspirés de vrais cas (phishing, arnaques SMS, faux supports), adaptés à ton niveau."
          />
          <HowCard
            title="2. Choix guidés"
            desc="Cliquer, ignorer, signaler… puis comprendre pourquoi c’était risqué (ou sûr)."
          />
          <HowCard
            title="3. Feedback immédiat"
            desc="Tu apprends les signaux : URL, expéditeur, urgence, pièces jointes, formulaires, etc."
          />
        </div>
      </section>
    </main>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function HowCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border bg-white p-6">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-600">{desc}</p>
    </div>
  );
}
