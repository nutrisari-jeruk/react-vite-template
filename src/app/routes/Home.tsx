import { Link } from "react-router-dom";
import { Badge, Button, Card } from "@/components";
import { ROUTES } from "@/config/constants";

function HomePage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Badge variant="primary" size="sm">
              v1.0
            </Badge>
            <Badge variant="success" size="sm">
              Production Ready
            </Badge>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Welcome to React Frontend Template
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            A production-ready template with React Router, TanStack Query,
            Tailwind CSS, and a beautiful component library.
          </p>
        </div>

        <Card className="mb-8 p-6">
          <h2 className="mb-4 text-xl font-semibold">Quick Navigation</h2>
          <p className="mb-4 text-gray-600">
            Explore the features and examples available in this template:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link to={ROUTES.ABOUT}>
              <Button variant="outline-primary" className="w-full">
                About
              </Button>
            </Link>
            <Link to={ROUTES.CONTACT}>
              <Button variant="outline-secondary" className="w-full">
                Contact
              </Button>
            </Link>
            <Link to={ROUTES.EXAMPLES.FORM_VALIDATION}>
              <Button variant="outline-primary" className="w-full">
                Form Validation
              </Button>
            </Link>
            <Link to={ROUTES.COMPONENTS}>
              <Button variant="primary" className="w-full">
                View Components
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">⚛️</span>
              <h3 className="text-lg font-semibold">Modern Stack</h3>
            </div>
            <p className="mb-3 text-sm text-gray-600">
              Built with React 18, TypeScript, and Vite for the best developer
              experience.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge size="sm">React</Badge>
              <Badge size="sm">TypeScript</Badge>
              <Badge size="sm">Vite</Badge>
              <Badge size="sm">Tailwind</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <h3 className="text-lg font-semibold">UI Components</h3>
            </div>
            <p className="mb-3 text-sm text-gray-600">
              Pre-built accessible components with Tailwind CSS styling.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge size="sm">Accessible</Badge>
              <Badge size="sm">Responsive</Badge>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              <h3 className="text-lg font-semibold">Developer Tools</h3>
            </div>
            <p className="mb-3 text-sm text-gray-600">
              ESLint, Prettier, Vitest, and Docker ready for production.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge size="sm">Testing</Badge>
              <Badge size="sm">Linting</Badge>
              <Badge size="sm">Docker</Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
