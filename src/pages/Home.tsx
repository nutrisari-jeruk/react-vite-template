import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="primary" pill>
              v1.0
            </Badge>
            <Badge variant="success" pill dot>
              Production Ready
            </Badge>
          </div>
          <h1 className="text-4xl font-bold">
            Welcome to React Frontend Template
          </h1>
          <p className="text-lg text-gray-600">
            A production-ready template with React Router, Tailwind CSS,
            TanStack Query, and more
          </p>
        </div>

        <Card variant="elevated" className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Quick Navigation</h2>
          <p className="text-gray-600 mb-6">
            Explore the features and examples available in this template
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about">
              <Button variant="primary" size="lg">
                About
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Contact
              </Button>
            </Link>
            <Link to="/form-validation">
              <Button variant="primary" size="lg">
                Form Validation
              </Button>
            </Link>
            <Link to="/components">
              <Button variant="outline-primary" size="lg">
                View Components
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            variant="outlined"
            title="Modern Stack"
            description="Built with React 18, TypeScript, and Vite"
          >
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="info" size="sm">
                React
              </Badge>
              <Badge variant="info" size="sm">
                TypeScript
              </Badge>
              <Badge variant="info" size="sm">
                Vite
              </Badge>
            </div>
          </Card>

          <Card
            variant="outlined"
            title="UI Components"
            description="Pre-built accessible components with Tailwind CSS"
          >
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="success" size="sm">
                Tailwind
              </Badge>
              <Badge variant="success" size="sm">
                Accessible
              </Badge>
              <Badge variant="success" size="sm">
                Responsive
              </Badge>
            </div>
          </Card>

          <Card
            variant="outlined"
            title="Developer Tools"
            description="ESLint, Prettier, Vitest, and Docker ready"
          >
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="warning" size="sm">
                Testing
              </Badge>
              <Badge variant="warning" size="sm">
                Linting
              </Badge>
              <Badge variant="warning" size="sm">
                Docker
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
