import { useNavigate } from "react-router-dom";
import { Card } from "@/components";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your credentials to access your account
        </p>
      </div>
      <LoginForm onSuccess={() => navigate("/dashboard")} />
    </Card>
  );
}
