import Link from "next/link";

export default function ScenariosPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Scénarios</h1>
      <p className="mt-2 text-zinc-600">
        Lance un scénario et entraîne-toi à repérer les signaux d’arnaque.
      </p>

      <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6">
        <p className="text-sm text-zinc-600">
          (MVP) Ici on affichera la liste venant de la base (catégorie, difficulté, score).
        </p>

        <div className="mt-4 flex gap-3">
          <Link
            href="/dashboard"
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Voir ma progression
          </Link>
        </div>
      </div>
    </main>
  );
}
