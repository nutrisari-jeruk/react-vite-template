import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to React Frontend Template
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        A production-ready template with React Router, Tailwind CSS, TanStack
        Query, and more
      </p>
      <div className="flex gap-4">
        <Link
          to="/about"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          About
        </Link>
        <Link
          to="/contact"
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Contact
        </Link>
      </div>
    </div>
  );
}
