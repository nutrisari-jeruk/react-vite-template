import { cn } from "@/utils/cn";

interface AuthBrandingProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function AuthBranding({
  title = "Single Sign-On (SSO)",
  subtitle,
  className,
}: AuthBrandingProps) {
  return (
    <div className={cn("mb-8 text-center", className)}>
      <h1 className="text-xl font-bold text-balance text-gray-900 sm:text-2xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-lg font-semibold text-pretty text-gray-900 sm:text-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
