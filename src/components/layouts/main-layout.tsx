import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function MainLayout() {
  return (
    <div className="min-h-screen flex bg-[color-gray-1] dark:bg-[color-dark]">
      <Navbar />
      <div className="flex flex-col flex-1">
        <main className="grow p-4 md:p-6 dark:text-white">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;
