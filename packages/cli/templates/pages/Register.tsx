import { useNavigate } from "react-router-dom";
import { Card } from "@/components";
import { RegisterForm } from "@/features/auth/components";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Get started with your free account today
        </p>
      </div>
      <RegisterForm onSuccess={() => navigate("/dashboard")} />
    </Card>
  );
}
