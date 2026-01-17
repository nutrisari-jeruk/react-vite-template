import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

interface MenuItem {
  path: string;
  label: string;
}

const menuItems: MenuItem[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/components", label: "Components" },
  { path: "/examples/error-handling", label: "Error Examples" },
  { path: "/examples/auth", label: "Auth Example" },
  { path: "/examples/form-validation", label: "Form Validation" },
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
          className="bg-primary fixed top-4 left-4 z-50 rounded-md p-2 text-white shadow-lg transition-colors hover:bg-[color-blue-dark] md:hidden dark:bg-[color-dark-2] dark:hover:bg-[color-dark-3]"
          aria-label="Open menu"
        >
          <svg
            className="h-6 w-6"
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
          className="fixed inset-0 z-30 bg-black/50 md:hidden dark:bg-black/70"
          onClick={closeMenu}
        />
      )}

      <aside
        className={`bg-primary fixed inset-y-0 left-0 z-40 w-64 transform text-white shadow-lg md:static dark:bg-[color-dark-2] ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-white/20 p-6 dark:border-[color-dark-3]">
          <Link
            to="/"
            className="text-xl font-bold transition-colors hover:text-white/80 dark:hover:text-[color-dark-7]"
            onClick={closeMenu}
          >
            React Template
          </Link>
          <button
            onClick={closeMenu}
            className="rounded-md p-2 transition-colors hover:bg-white/10 md:hidden dark:hover:bg-[color-dark-3]"
            aria-label="Close menu"
          >
            <svg
              className="h-6 w-6"
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
              className={`block rounded-md px-4 py-3 transition-colors hover:bg-white/10 dark:hover:bg-[color-dark-3] ${
                isActive(item.path)
                  ? "bg-secondary text-white dark:bg-[color-dark-3]"
                  : ""
              }`}
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
