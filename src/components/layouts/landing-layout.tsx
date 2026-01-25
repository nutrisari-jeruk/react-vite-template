import { Outlet } from "react-router-dom";
import { Footer } from "./footer";

/**
 * LandingLayout
 *
 * Main layout without navbar for landing/home pages.
 * Use this for public-facing pages where you don't want the sidebar navigation.
 */
export function LandingLayout() {
  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 flex-col">
        <main className="grow p-4 md:p-6 dark:text-white">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default LandingLayout;
