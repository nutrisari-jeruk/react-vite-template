import { Link } from "react-router-dom";
import { Badge, Button, Card } from "@/components";
import { ROUTES } from "@/config/constants";

function HomePage() {
  const features = [
    {
      icon: "⚛️",
      title: "Modern Stack",
      description:
        "React 19, TypeScript, and Vite for the best developer experience.",
      badges: ["React", "TypeScript", "Vite"],
    },
    {
      icon: "🎨",
      title: "UI Components",
      description:
        "Pre-built accessible components with beautiful Tailwind CSS styling.",
      badges: ["Accessible", "Responsive"],
    },
    {
      icon: "⚡",
      title: "State Management",
      description:
        "TanStack Query for server state with built-in caching and synchronization.",
      badges: ["Query", "Mutation"],
    },
    {
      icon: "🛡️",
      title: "Type Safety",
      description:
        "End-to-end TypeScript with strict mode for reliable, maintainable code.",
      badges: ["Strict", "Auto-import"],
    },
    {
      icon: "🧪",
      title: "Testing Ready",
      description:
        "Vitest, Testing Library, and MSW for comprehensive test coverage.",
      badges: ["Unit", "Integration"],
    },
    {
      icon: "🚀",
      title: "Production Ready",
      description:
        "ESLint, Prettier, Docker, and CI/CD configuration out of the box.",
      badges: ["Linting", "Docker"],
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-12rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-8 flex justify-center gap-2">
            <Badge variant="primary" size="sm">
              v1.0
            </Badge>
            <Badge variant="success" size="sm">
              Production Ready
            </Badge>
          </div>

          <h1 className="mb-6 text-center text-5xl font-bold tracking-tight text-balance text-gray-900 sm:text-6xl">
            Ship faster with
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              React Frontend Template
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-center text-xl text-pretty text-gray-600">
            A production-ready template with React Router, TanStack Query,
            Tailwind CSS, and a beautiful component library. Start building your
            app in minutes.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to={ROUTES.DASHBOARD}>
              <Button variant="primary" size="lg" className="min-w-[160px]">
                Get Started
              </Button>
            </Link>
            <Link to={ROUTES.COMPONENTS}>
              <Button
                variant="outline-primary"
                size="lg"
                className="min-w-[160px]"
              >
                View Components
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 sm:text-4xl">
                20+
              </div>
              <div className="text-sm text-gray-600">Components</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 sm:text-4xl">
                100%
              </div>
              <div className="text-sm text-gray-600">TypeScript</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 sm:text-4xl">
                A11y
              </div>
              <div className="text-sm text-gray-600">First</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Quick Navigation
            </h2>
            <p className="text-pretty text-gray-600">
              Explore the features and examples available in this template
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to={ROUTES.DASHBOARD} className="group">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50">
                  <span className="text-2xl" aria-hidden="true">
                    📊
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">Dashboard</div>
                    <div className="text-sm text-gray-600">View demo</div>
                  </div>
                </div>
              </Link>
              <Link to={ROUTES.ABOUT} className="group">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50">
                  <span className="text-2xl" aria-hidden="true">
                    ℹ️
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">About</div>
                    <div className="text-sm text-gray-600">Learn more</div>
                  </div>
                </div>
              </Link>
              <Link to={ROUTES.EXAMPLES.FORM_VALIDATION} className="group">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50">
                  <span className="text-2xl" aria-hidden="true">
                    📝
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">Forms</div>
                    <div className="text-sm text-gray-600">Validation</div>
                  </div>
                </div>
              </Link>
              <Link to={ROUTES.COMPONENTS} className="group">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors group-hover:border-indigo-300 group-hover:bg-indigo-50">
                  <span className="text-2xl" aria-hidden="true">
                    🧩
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">Components</div>
                    <div className="text-sm text-gray-600">Browse all</div>
                  </div>
                </div>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Everything you need to build fast
            </h2>
            <p className="text-pretty text-gray-600">
              Packed with best practices and modern tooling
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="p-6 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="flex size-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mb-4 text-sm text-pretty text-gray-600">
                  {feature.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {feature.badges.map((badge) => (
                    <Badge key={badge} size="sm" variant="info">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-center text-white sm:p-12">
            <h2 className="mb-4 text-3xl font-bold">
              Ready to build something amazing?
            </h2>
            <p className="mb-8 text-indigo-100">
              Get started with our comprehensive dashboard or explore the
              component library to see what's possible.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to={ROUTES.DASHBOARD}>
                <Button variant="white" size="lg" className="min-w-[160px]">
                  Explore Dashboard
                </Button>
              </Link>
              <Link to={ROUTES.COMPONENTS}>
                <Button
                  variant="outline-white"
                  size="lg"
                  className="min-w-[160px]"
                >
                  Components
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
