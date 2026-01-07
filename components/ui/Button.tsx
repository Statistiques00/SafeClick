// components/ui/Button.tsx
export default function Button({ children, ...props }: any) {
  return (
    <button
      {...props}
      className="w-full rounded-lg bg-primary py-3 text-white font-semibold hover:bg-primaryDark"
    >
      {children}
    </button>
  );
}
