export default function ApprendrePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Apprendre</h1>
      <p className="mt-2 text-zinc-600">
        Un parcours guidé pour comprendre les signaux d’alerte.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Module title="Liens & URL" desc="Domaines, redirections, faux sites." />
        <Module title="Urgence & pression" desc="Les techniques de manipulation." />
        <Module title="Expéditeur & usurpation" desc="Vérifier l’identité et le contexte." />
        <Module title="Pièces jointes" desc="Risques et bonnes pratiques." />
        <Module title="Réseaux sociaux" desc="DM, pubs, faux concours." />
        <Module title="Réflexes pro" desc="Que faire en entreprise ?" />
      </div>
    </main>
  );
}

function Module({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50 transition">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
