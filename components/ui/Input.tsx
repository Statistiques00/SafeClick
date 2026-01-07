// components/ui/Input.tsx
export default function Input(props: any) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
