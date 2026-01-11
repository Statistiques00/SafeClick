import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AccountSettings from "./AccountSettings";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Connecté en tant que <span className="font-semibold">{session.user.email}</span>
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Mon compte</h2>
          <p className="mt-2 text-sm text-slate-600">
            Modifie ton email et ton mot de passe.
          </p>
          <div className="mt-6">
            <AccountSettings currentEmail={session.user.email} />
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6">
          <h2 className="text-lg font-semibold">Infos</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ici tu pourras mettre ta progression, tes badges, etc.
          </p>

          <div className="mt-6 grid gap-3">
            <Stat title="Progression" value="0%" />
            <Stat title="Scénarios terminés" value="0" />
            <Stat title="Badges" value="0" />
          </div>
        </div>
      </div>
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}