// src/components/Protected.tsx
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/app/hooks";

interface ProtectedProps {
  children: React.ReactNode; // thay JSX.Element => React.ReactNode
}

export default function Protected({ children }: ProtectedProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
