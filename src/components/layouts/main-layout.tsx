import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function MainLayout() {
  return (
    <div className="flex min-h-dvh bg-[color-gray-1] dark:bg-[color-dark]">
      <Navbar />
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
