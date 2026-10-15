import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Page not found
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  );
}
