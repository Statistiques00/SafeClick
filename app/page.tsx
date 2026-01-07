import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-6">
      <section className="pt-14 sm:pt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Entraînement anti-phishing • Scénarios réalistes • Progression
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl">
          Apprends à repérer les arnaques{" "}
          <span className="text-zinc-500">avant qu’elles ne te piègent.</span>
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 sm:text-lg">
          SafeClicks te propose des scénarios (email, SMS, réseaux sociaux) pour
          t’entraîner à identifier les signaux d’alerte : urgence, usurpation,
          liens douteux, pièces jointes, etc. Le tout avec un suivi de progression.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/signup"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Commencer
          </Link>
          <Link
            href="/scenarios"
            className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-50"
          >
            Voir les scénarios
          </Link>
          <Link
            href="/apprendre"
            className="rounded-full px-2 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Parcours d’apprentissage →
          </Link>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 sm:p-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <MiniStat title="Catégories" value="Email • SMS • Réseaux" />
            <MiniStat title="Objectif" value="Réflexes & vigilance" />
            <MiniStat title="Progression" value="Points • niveaux • badges" />
          </div>
        </div>
      </section>

      <section className="py-14">
        <h2 className="text-xl font-semibold tracking-tight">
          Comment ça fonctionne
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-600">
          Une boucle simple : tu observes → tu décides → tu reçois un feedback → tu progresses.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="1. Scénarios réalistes"
            desc="Des messages inspirés de vrais cas (phishing, fausses urgences, usurpations)."
          />
          <Feature
            title="2. Choix guidés"
            desc="Cliquer, ignorer, signaler… puis comprendre pourquoi c’était risqué ou safe."
          />
          <Feature
            title="3. Feedback immédiat"
            desc="Tu apprends les signaux : URL, expéditeur, contexte, pression psychologique."
          />
          <Feature
            title="4. Suivi de progression"
            desc="Historique, score, niveau, points : tu vois ce que tu maîtrises (et ce qui reste)."
          />
          <Feature
            title="5. Parcours d’apprentissage"
            desc="Modules courts : liens, pièces jointes, fraude au support, réseaux sociaux…"
          />
          <Feature
            title="6. Objectif pro"
            desc="Développer des réflexes utilisables au quotidien, au travail comme à la maison."
          />
        </div>
      </section>

      <section className="pb-16">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              Prêt à t’entraîner ?
            </h3>
            <p className="mt-1 text-sm text-zinc-600">
              Crée un compte et commence par les scénarios “Facile”.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Créer un compte
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-50"
            >
              Explorer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50 transition">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600">{desc}</p>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-xs text-zinc-600">{title}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}
