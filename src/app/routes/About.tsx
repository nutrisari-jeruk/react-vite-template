import { Link } from "react-router-dom";
import { Badge, Button, Card } from "@/components";
import { ROUTES } from "@/config/constants";

function AboutPage() {
  return (
    <div className="min-h-[calc(100dvh-12rem)] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link to={ROUTES.HOME}>
            <Button variant="outline-secondary" size="sm" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="mb-4 text-4xl font-bold text-balance text-gray-900">
            About This Template
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-pretty text-gray-600">
            This is a comprehensive React frontend template built with modern
            tools and best practices.
          </p>
        </div>

        <Card className="mb-8 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-balance">
            <span>🚀</span> Tech Stack
          </h2>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">React 19</Badge>
              <span className="text-gray-600">with TypeScript</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Vite</Badge>
              <span className="text-gray-600">for fast development</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">React Router</Badge>
              <span className="text-gray-600">for routing</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Tailwind CSS</Badge>
              <span className="text-gray-600">for styling</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">TanStack Query</Badge>
              <span className="text-gray-600">for data fetching</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Axios</Badge>
              <span className="text-gray-600">for HTTP requests</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Vitest</Badge>
              <span className="text-gray-600">for testing</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">Husky</Badge>
              <span className="text-gray-600">& lint-staged for git hooks</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="primary">ESLint & Prettier</Badge>
              <span className="text-gray-600">for code quality</span>
            </div>
          </div>
        </Card>

        <Card className="mb-8 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold text-balance">
            <span>✨</span> Key Features
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-balance">
                Component Library
              </h3>
              <p className="text-sm text-pretty text-gray-600">
                Pre-built, accessible components ready to use
              </p>
              <Badge variant="primary" size="sm" className="mt-2">
                UI/UX
              </Badge>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-balance">Type Safety</h3>
              <p className="text-sm text-pretty text-gray-600">
                Full TypeScript support for better DX
              </p>
              <Badge variant="success" size="sm" className="mt-2">
                DX
              </Badge>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-balance">
                Optimized Build
              </h3>
              <p className="text-sm text-pretty text-gray-600">
                Vite for lightning-fast hot module replacement
              </p>
              <Badge variant="warning" size="sm" className="mt-2">
                Performance
              </Badge>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-2 font-semibold text-balance">Testing Ready</h3>
              <p className="text-sm text-pretty text-gray-600">
                Vitest configured with testing utilities
              </p>
              <Badge variant="danger" size="sm" className="mt-2">
                Quality
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <h2 className="mb-4 text-2xl font-semibold text-balance">
            Ready to Build?
          </h2>
          <p className="mb-4 text-pretty text-gray-600">
            Explore the component library and start building your next amazing
            project!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={ROUTES.COMPONENTS}>
              <Button variant="primary">View Components</Button>
            </Link>
            <Link to={ROUTES.HOME}>
              <Button variant="outline-secondary">Go Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AboutPage;
