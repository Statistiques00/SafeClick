export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Catégories</h1>
      <p className="mt-2 text-zinc-600">
        Choisis une catégorie pour t’entraîner sur des scénarios adaptés.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card title="Email" desc="Phishing, fausses factures, pièces jointes." />
        <Card title="SMS" desc="Livraisons, banques, urgences, liens courts." />
        <Card title="Réseaux sociaux" desc="Faux concours, DM, usurpations, pubs." />
      </div>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 hover:bg-zinc-50 transition">
      <h2 className="text-sm font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{desc}</p>
    </div>
  );
}
