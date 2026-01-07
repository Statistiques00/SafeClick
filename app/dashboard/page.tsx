import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <pre className="mt-4 rounded bg-gray-100 p-4">
        {JSON.stringify(session, null, 2)}
      </pre>
    </main>
  );
}
