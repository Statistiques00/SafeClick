export default function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-6 text-3xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
