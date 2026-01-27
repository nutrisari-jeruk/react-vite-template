import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/features/auth/components";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh bg-[#1D4ED8] p-[116px]">
      {/* Main Container with shadow - 1149x751px */}
      <div className="relative mx-auto h-[751px] w-full max-w-[1149px] rounded-[8px] border border-white bg-white shadow-xl">
        <div className="flex h-full">
          {/* Left side - Illustration Image - 563x751px */}
          <div className="hidden flex-shrink-0 md:block md:w-[563px]">
            <img
              src="/login.svg"
              alt="Login Illustration"
              className="h-full w-full rounded-l-[8px] object-cover"
            />
          </div>

          {/* Right side - Login form */}
          <div className="flex w-full flex-col justify-center px-8 md:px-12">
            {/* Page Title */}
            <div className="mb-10">
              <h1 className="text-2xl leading-8 font-bold text-[#111827]">
                Selamat Datang
              </h1>
            </div>

            {/* Login Form */}
            <LoginForm onSuccess={() => navigate("/dashboard")} />
          </div>
        </div>
      </div>
    </div>
  );
}
