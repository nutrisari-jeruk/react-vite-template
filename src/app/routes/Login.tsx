import { useNavigate } from "react-router-dom";
import { Card } from "@/components";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-8 shadow-md">
      <LoginForm
        onSuccess={() => navigate("/dashboard")}
        defaultEmail="user@example.com"
        defaultPassword="password123"
      />
    </Card>
  );
}
