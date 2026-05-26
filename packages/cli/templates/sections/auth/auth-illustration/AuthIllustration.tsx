import { ImageWithFallback } from "@/components/ui";
import { cn } from "@/utils/cn";

interface AuthIllustrationProps {
  src?: string;
  alt?: string;
  className?: string;
}

export function AuthIllustration({
  src = "/login.svg",
  alt = "Login illustration",
  className,
}: AuthIllustrationProps) {
  return (
    <div className={cn("relative hidden lg:block lg:w-1/2", className)}>
      <ImageWithFallback
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-blue-50">
            <div className="text-center">
              <div className="mx-auto mb-4 size-16 rounded-full bg-blue-100" />
              <p className="text-sm text-gray-400">Illustration</p>
            </div>
          </div>
        }
      />
    </div>
  );
}
