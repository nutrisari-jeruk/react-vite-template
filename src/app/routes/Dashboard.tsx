import { useAuth } from "@/features/auth";

export default function Dashboard() {
  const { isAuthenticated, accessToken, tokenExpiresIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your protected dashboard.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Authentication Status
        </h2>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Authenticated:</dt>
            <dd className="font-medium text-gray-900 dark:text-white">
              {isAuthenticated ? "Yes" : "No"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Access Token:</dt>
            <dd className="max-w-xs truncate font-mono text-xs text-gray-900 dark:text-white">
              {accessToken || "None"}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600 dark:text-gray-400">Expires In:</dt>
            <dd className="font-medium text-gray-900 dark:text-white">
              {tokenExpiresIn !== null
                ? `${Math.floor(tokenExpiresIn / 1000)}s`
                : "N/A"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-800/50">
        <p className="text-gray-500 dark:text-gray-400">
          Dashboard content placeholder. Add your widgets, charts, or data
          tables here.
        </p>
      </div>
    </div>
  );
}
