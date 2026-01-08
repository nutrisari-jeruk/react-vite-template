import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <Link to="/" className="text-blue-500 hover:text-blue-600">
        &larr; Back to Home
      </Link>
      <h1 className="text-3xl font-bold mt-6 mb-4">About This Template</h1>
      <div className="space-y-4 text-gray-700">
        <p>
          This is a comprehensive React frontend template built with modern
          tools and best practices.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Tech Stack</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>React 19 with TypeScript</li>
          <li>Vite for fast development</li>
          <li>React Router for routing</li>
          <li>Tailwind CSS for styling</li>
          <li>TanStack Query for data fetching</li>
          <li>Axios for HTTP requests</li>
          <li>Vitest for testing</li>
          <li>Husky & lint-staged for git hooks</li>
          <li>ESLint & Prettier for code quality</li>
        </ul>
      </div>
    </div>
  );
}
