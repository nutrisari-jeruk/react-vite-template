import { Link } from "react-router-dom";
import Card from "../components/Card";
import Badge from "../components/Badge";
import Button from "../components/Button";

const BackIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const techStack = [
  {
    name: "React 19",
    variant: "primary" as const,
    description: "with TypeScript",
  },
  {
    name: "Vite",
    variant: "success" as const,
    description: "for fast development",
  },
  {
    name: "React Router",
    variant: "info" as const,
    description: "for routing",
  },
  {
    name: "Tailwind CSS",
    variant: "primary" as const,
    description: "for styling",
  },
  {
    name: "TanStack Query",
    variant: "warning" as const,
    description: "for data fetching",
  },
  {
    name: "Axios",
    variant: "success" as const,
    description: "for HTTP requests",
  },
  {
    name: "Vitest",
    variant: "danger" as const,
    description: "for testing",
  },
  {
    name: "Husky",
    variant: "info" as const,
    description: "& lint-staged for git hooks",
  },
  {
    name: "ESLint & Prettier",
    variant: "default" as const,
    description: "for code quality",
  },
];

const features = [
  {
    title: "Component Library",
    description: "Pre-built, accessible components ready to use",
    badge: "UI/UX",
  },
  {
    title: "Type Safety",
    description: "Full TypeScript support for better DX",
    badge: "DX",
  },
  {
    title: "Optimized Build",
    description: "Vite for lightning-fast hot module replacement",
    badge: "Performance",
  },
  {
    title: "Testing Ready",
    description: "Vitest configured with testing utilities",
    badge: "Quality",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/">
            <Button variant="outline-primary" iconLeft={<BackIcon />}>
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          <Card variant="elevated" className="p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              About This Template
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is a comprehensive React frontend template built with modern
              tools and best practices. It provides a solid foundation for
              building scalable, maintainable web applications with excellent
              developer experience.
            </p>
          </Card>

          <Card variant="elevated" className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">🚀</span>
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Badge variant={tech.variant} size="md" pill>
                    {tech.name}
                  </Badge>
                  <span className="text-sm text-gray-600 pt-0.5">
                    {tech.description}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card variant="elevated" className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">✨</span>
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} variant="flat" className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <Badge variant="info" size="sm">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              ))}
            </div>
          </Card>

          <Card
            variant="elevated"
            className="p-8 bg-linear-to-r from-blue-50 to-purple-50"
          >
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Build?
              </h2>
              <p className="text-gray-700 mb-6">
                Explore the component library and start building your next
                amazing project!
              </p>
              <div className="flex justify-center gap-4">
                <Link to="/components">
                  <Button variant="primary" size="lg">
                    View Components
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline-primary" size="lg">
                    Go Home
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
