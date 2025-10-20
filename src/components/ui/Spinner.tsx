// src/components/ui/Spinner.tsx
export default function Spinner({ size = 5 }: { size?: number }) {
  return <div className={`animate-spin rounded-full border-4 border-t-transparent border-blue-600 w-${size} h-${size}`} />;
}
