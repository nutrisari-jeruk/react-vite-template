import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/utils/cn";

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  // --- FRONTIER-FE: NAV ITEMS ---
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="bg-primary fixed top-2 left-2 z-50 flex size-12 items-center justify-center rounded-md text-white shadow-lg transition-colors hover:bg-blue-700 md:hidden dark:bg-gray-800 dark:hover:bg-gray-700"
          aria-label="Open menu"
        >
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden dark:bg-black/70"
          onClick={closeMenu}
        />
      )}

      <aside
        className={cn(
          "bg-primary fixed inset-y-0 left-0 z-50 w-64 transform text-white shadow-lg md:static dark:bg-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col transition-transform duration-150 ease-out motion-reduce:transition-none md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/20 p-6 dark:border-gray-700">
          <Link
            to="/"
            className="text-xl font-bold transition-colors hover:text-white/80 dark:hover:text-gray-200"
            onClick={closeMenu}
          >
            My App
          </Link>
          <button
            onClick={closeMenu}
            className="rounded-md p-2 transition-colors hover:bg-white/10 md:hidden dark:hover:bg-gray-700"
            aria-label="Close menu"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={cn(
                "block rounded-md px-4 py-3 transition-colors hover:bg-white/10 dark:hover:bg-gray-700",
                isActive(item.path) &&
                  "bg-secondary text-white dark:bg-gray-700"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Navbar;
