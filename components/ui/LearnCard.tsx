// components/ui/LearnCard.tsx
export default function LearnCard({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-lg bg-primary text-white flex items-center justify-center">
          ▶
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <button className="text-primary font-medium">Commencer</button>
    </div>
  );
}
