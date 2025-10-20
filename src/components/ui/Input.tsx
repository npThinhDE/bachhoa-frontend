// src/components/ui/Input.tsx
type Props = React.InputHTMLAttributes<HTMLInputElement>;
export default function Input(props: Props) {
  return <input {...props} className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${props.className ?? ''}`} />;
}
