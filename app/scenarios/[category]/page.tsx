import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ScenarioQuiz from "@/components/scenarios/ScenarioQuiz";

const allowed = ["EMAIL", "SMS", "SOCIAL"] as const;
type Allowed = (typeof allowed)[number];

export default async function ScenarioCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { category } = await params;
  const cat = category?.toUpperCase();

  if (!allowed.includes(cat as Allowed)) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <ScenarioQuiz category={cat as Allowed} />
    </main>
  );
}