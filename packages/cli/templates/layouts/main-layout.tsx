import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface MainLayoutProps {
  showNavbar?: boolean;
}

export function MainLayout({ showNavbar = true }: MainLayoutProps) {
  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-900">
      {showNavbar && <Navbar />}
      <div className="flex flex-1 flex-col">
        <main className="grow p-4 md:p-6 dark:text-white">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
