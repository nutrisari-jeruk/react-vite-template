import fs from "fs-extra";
import path from "path";
import type { RouteConfig } from "../types.js";
import { logger } from "./logger.js";

// Marker comments used in base templates for reliable insertion
const MARKERS = {
  LAZY_IMPORTS: "// --- FRONTIER-FE: LAZY IMPORTS ---",
  ROUTES: "// --- FRONTIER-FE: ROUTES ---",
  ROUTE_CONSTANTS: "// --- FRONTIER-FE: ROUTE CONSTANTS ---",
  NAV_ITEMS: "// --- FRONTIER-FE: NAV ITEMS ---",
  ROUTE_METADATA: "// --- FRONTIER-FE: ROUTE METADATA ---",
};

const LAYOUT_MAP: Record<string, { component: string; import: string }> = {
  main: {
    component: "MainLayout",
    import: "MainLayout",
  },
  landing: {
    component: "LandingLayout",
    import: "LandingLayout",
  },
  auth: {
    component: "AuthLayout",
    import: "AuthLayout",
  },
  authenticated: {
    component: "AuthenticatedLayout",
    import: "AuthenticatedLayout",
  },
};

/**
 * Wire a page's route into the project files:
 * - router.tsx (lazy import + route entry)
 * - constants.ts (ROUTES constant)
 * - navbar.tsx (nav link, if specified)
 * - routes-metadata.ts (page title/description)
 */
export async function wireRoute(
  cwd: string,
  route: RouteConfig
): Promise<void> {
  await wireRouterFile(cwd, route);
  await wireConstants(cwd, route);
  if (route.navLink) {
    await wireNavbar(cwd, route);
  }
  if (route.metadata) {
    await wireRouteMetadata(cwd, route);
  }
}

/**
 * Add lazy import and route config to router.tsx
 */
async function wireRouterFile(
  cwd: string,
  route: RouteConfig
): Promise<void> {
  const routerPath = path.resolve(cwd, "src/app/router.tsx");
  if (!(await fs.pathExists(routerPath))) {
    logger.warn("router.tsx not found, skipping route wiring.");
    return;
  }

  let content = await fs.readFile(routerPath, "utf-8");

  // Skip if this component is already imported
  if (content.includes(`import("${route.importPath}")`)) {
    logger.dim(`  Route for ${route.componentName} already wired in router.tsx`);
    return;
  }

  // 1. Add lazy import
  const lazyImport = `const ${route.componentName} = lazy(() => import("${route.importPath}"));`;

  if (content.includes(MARKERS.LAZY_IMPORTS)) {
    content = content.replace(
      MARKERS.LAZY_IMPORTS,
      MARKERS.LAZY_IMPORTS + "\n" + lazyImport
    );
  } else {
    // Fallback: insert before the first function declaration
    const funcMatch = content.match(/^(function |const \w+ = )/m);
    if (funcMatch && funcMatch.index !== undefined) {
      content =
        content.slice(0, funcMatch.index) +
        lazyImport +
        "\n" +
        content.slice(funcMatch.index);
    }
  }

  // 2. Add route entry
  const routeEntry = buildRouteEntry(route);

  if (content.includes(MARKERS.ROUTES)) {
    content = content.replace(
      MARKERS.ROUTES,
      MARKERS.ROUTES + "\n" + routeEntry
    );
  } else {
    // Fallback: insert before the catch-all route (path: "*")
    const catchAllMatch = content.match(/\{\s*\n\s*path:\s*"\*"/);
    if (catchAllMatch && catchAllMatch.index !== undefined) {
      content =
        content.slice(0, catchAllMatch.index) +
        routeEntry +
        "\n  " +
        content.slice(catchAllMatch.index);
    }
  }

  await fs.writeFile(routerPath, content, "utf-8");
  logger.success(`  Wired route in router.tsx`);
}

/**
 * Build the JSX route entry for createBrowserRouter
 */
function buildRouteEntry(route: RouteConfig): string {
  const { componentName } = route;
  const isIndex = route.path === "/";
  const pathProp = isIndex ? `path: "/"` : `path: "${route.path}"`;

  // Standalone page (no layout)
  if (!route.layout) {
    if (route.protected) {
      return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <ProtectedRoute>
          <LazyPage>
            <${componentName} />
          </LazyPage>
        </ProtectedRoute>
      </>
    ),
  },`;
    }
    return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <${componentName} />
        </LazyPage>
      </>
    ),
  },`;
  }

  // Page with layout
  const layoutInfo = LAYOUT_MAP[route.layout];
  if (!layoutInfo) {
    return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <LazyPage>
          <${componentName} />
        </LazyPage>
      </>
    ),
  },`;
  }

  const layoutComponent = layoutInfo.component;

  // Protected + AuthLoader (e.g., dashboard)
  if (route.protected && route.authLoader) {
    return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <ProtectedRoute>
          <AuthLoader
            renderLoading={() => (
              <div className="flex min-h-dvh items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
              </div>
            )}
            renderError={() => {
              window.location.href = "/login";
              return null;
            }}
          >
            <${layoutComponent} />
          </AuthLoader>
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <${componentName} />
          </LazyPage>
        ),
      },
    ],
  },`;
  }

  // Protected without AuthLoader
  if (route.protected) {
    return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <ProtectedRoute>
          <${layoutComponent} />
        </ProtectedRoute>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <${componentName} />
          </LazyPage>
        ),
      },
    ],
  },`;
  }

  // Standard layout page
  return `  {
    ${pathProp},
    element: (
      <>
        <MetadataUpdater />
        <${layoutComponent} />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <${componentName} />
          </LazyPage>
        ),
      },
    ],
  },`;
}

/**
 * Add route constant to constants.ts
 */
async function wireConstants(
  cwd: string,
  route: RouteConfig
): Promise<void> {
  const constantsPath = path.resolve(cwd, "src/config/constants.ts");
  if (!(await fs.pathExists(constantsPath))) {
    logger.warn("constants.ts not found, skipping route constant.");
    return;
  }

  let content = await fs.readFile(constantsPath, "utf-8");

  // Skip if already exists
  if (content.includes(`${route.constantKey}:`)) {
    logger.dim(`  Route constant ${route.constantKey} already exists`);
    return;
  }

  const entry = `  ${route.constantKey}: "${route.path}",`;

  if (content.includes(MARKERS.ROUTE_CONSTANTS)) {
    content = content.replace(
      MARKERS.ROUTE_CONSTANTS,
      MARKERS.ROUTE_CONSTANTS + "\n" + entry
    );
  } else {
    // Fallback: insert before the closing "} as const" of ROUTES
    const routesClose = content.match(
      /(export const ROUTES = \{[\s\S]*?)(} as const;)/
    );
    if (routesClose && routesClose.index !== undefined) {
      const insertPos =
        routesClose.index + routesClose[1].length;
      content =
        content.slice(0, insertPos) +
        entry +
        "\n" +
        content.slice(insertPos);
    }
  }

  await fs.writeFile(constantsPath, content, "utf-8");
  logger.success(`  Added ROUTES.${route.constantKey} to constants.ts`);
}

/**
 * Add navigation link to navbar.tsx
 */
async function wireNavbar(
  cwd: string,
  route: RouteConfig
): Promise<void> {
  if (!route.navLink) return;

  const navbarPath = path.resolve(cwd, "src/components/layouts/navbar.tsx");
  if (!(await fs.pathExists(navbarPath))) {
    logger.warn("navbar.tsx not found, skipping nav link.");
    return;
  }

  let content = await fs.readFile(navbarPath, "utf-8");

  // Skip if already has this path
  if (content.includes(`path: "${route.path}"`)) {
    logger.dim(`  Nav link for ${route.path} already exists`);
    return;
  }

  const entry = `  { path: "${route.path}", label: "${route.navLink.label}" },`;

  if (content.includes(MARKERS.NAV_ITEMS)) {
    content = content.replace(
      MARKERS.NAV_ITEMS,
      MARKERS.NAV_ITEMS + "\n" + entry
    );
  } else {
    // Fallback: insert before the closing "];" of menuItems
    const menuClose = content.match(
      /(const menuItems:\s*MenuItem\[\]\s*=\s*\[[\s\S]*?)(];)/
    );
    if (menuClose && menuClose.index !== undefined) {
      const insertPos = menuClose.index + menuClose[1].length;
      content =
        content.slice(0, insertPos) +
        entry +
        "\n" +
        content.slice(insertPos);
    }
  }

  await fs.writeFile(navbarPath, content, "utf-8");
  logger.success(`  Added "${route.navLink.label}" to navbar.tsx`);
}

/**
 * Add route metadata to routes-metadata.ts
 */
async function wireRouteMetadata(
  cwd: string,
  route: RouteConfig
): Promise<void> {
  if (!route.metadata) return;

  const metadataPath = path.resolve(cwd, "src/config/routes-metadata.ts");
  if (!(await fs.pathExists(metadataPath))) {
    logger.warn("routes-metadata.ts not found, skipping metadata.");
    return;
  }

  let content = await fs.readFile(metadataPath, "utf-8");

  // Skip if already has this path
  if (content.includes(`"${route.path}":`)) {
    logger.dim(`  Route metadata for ${route.path} already exists`);
    return;
  }

  const entry = `  "${route.path}": {
    title: "${route.metadata.title}",
    description: "${route.metadata.description}",
  },`;

  if (content.includes(MARKERS.ROUTE_METADATA)) {
    content = content.replace(
      MARKERS.ROUTE_METADATA,
      MARKERS.ROUTE_METADATA + "\n" + entry
    );
  } else {
    // Fallback: insert before the closing "};" of ROUTE_METADATA
    const metadataClose = content.match(
      /(export const ROUTE_METADATA:\s*Record<string,\s*RouteMetadata>\s*=\s*\{[\s\S]*?)(};)/
    );
    if (metadataClose && metadataClose.index !== undefined) {
      const insertPos = metadataClose.index + metadataClose[1].length;
      content =
        content.slice(0, insertPos) +
        entry +
        "\n" +
        content.slice(insertPos);
    }
  }

  await fs.writeFile(metadataPath, content, "utf-8");
  logger.success(`  Added metadata for "${route.path}"`);
}
