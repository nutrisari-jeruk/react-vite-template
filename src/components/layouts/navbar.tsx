import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { useUser, useLogout } from "@/features/auth/lib/auth-provider";

interface MenuItem {
  path: string;
  label: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/components", label: "Components" },
  {
    path: "/examples",
    label: "Examples",
    children: [
      { path: "/examples/error-handling", label: "Error Handling" },
      { path: "/examples/auth", label: "Authentication" },
      { path: "/examples/form-validation", label: "Form Validation" },
      { path: "/examples/data-table", label: "Data Table" },
    ],
  },
];

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const user = useUser();
  const logout = useLogout();

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.path)) return true;
    return item.children?.some((child) => isActive(child.path));
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const toggleDropdown = (path: string) => {
    setOpenDropdown(openDropdown === path ? null : path);
  };

  const closeDropdown = () => setOpenDropdown(null);

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleMenu}
          className="bg-primary z-overlay safe-top-0 safe-left-0 fixed top-2 left-2 flex size-12 items-center justify-center rounded-md text-white shadow-lg transition-colors hover:bg-blue-700 md:hidden dark:bg-gray-800 dark:hover:bg-gray-700"
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
          className="z-modal fixed inset-0 bg-black/50 md:hidden dark:bg-black/70"
          onClick={closeMenu}
        />
      )}

      <aside
        className={cn(
          "bg-primary z-sidebar fixed inset-y-0 left-0 w-64 transform text-white shadow-lg md:static dark:bg-gray-800",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "safe-top-0 flex flex-col transition-transform duration-200 ease-out motion-reduce:transition-none md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/20 p-6 dark:border-gray-700">
          <Link
            to="/"
            className="text-xl font-bold transition-colors hover:text-white/80 dark:hover:text-gray-200"
            onClick={closeMenu}
          >
            React Template
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
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              const isDropdownOpen = openDropdown === item.path;
              const isParentActiveState = isParentActive(item);

              const dropdownId = `dropdown-${item.path.replace(/\//g, "-")}`;
              const triggerId = `dropdown-trigger-${item.path.replace(/\//g, "-")}`;

              return (
                <div key={item.path} className="space-y-1">
                  <button
                    id={triggerId}
                    onClick={() => toggleDropdown(item.path)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-4 py-3 transition-colors hover:bg-white/10 dark:hover:bg-gray-700",
                      isParentActiveState &&
                        "bg-secondary text-white dark:bg-gray-700"
                    )}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-controls={dropdownId}
                  >
                    <span>{item.label}</span>
                    <svg
                      className={cn(
                        "size-4 transform transition-transform",
                        isDropdownOpen && "rotate-180"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div
                      id={dropdownId}
                      className="ml-4 space-y-1 border-l-2 border-white/20 pl-4 dark:border-gray-600"
                      role="menu"
                      aria-labelledby={triggerId}
                    >
                      {item.children?.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => {
                            closeMenu();
                            closeDropdown();
                          }}
                          className={cn(
                            "block rounded-md px-4 py-2 text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-700",
                            isActive(child.path) &&
                              "bg-secondary text-white dark:bg-gray-700"
                          )}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
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
            );
          })}

          {/* Auth Section */}
          <div className="border-t border-white/20 pt-4 dark:border-gray-700">
            {user.data ? (
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <p className="text-sm text-white/60 dark:text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-white dark:text-gray-200">
                    {user.data.email}
                  </p>
                </div>
                <button
                  onClick={() => logout.mutate(undefined)}
                  disabled={logout.isPending}
                  className="block w-full rounded-md px-4 py-2 text-left text-sm transition-colors hover:bg-white/10 disabled:opacity-50 dark:hover:bg-gray-700"
                >
                  {logout.isPending ? "Signing out..." : "Sign out"}
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block rounded-md px-4 py-2 text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="block rounded-md px-4 py-2 text-sm transition-colors hover:bg-white/10 dark:hover:bg-gray-700"
                >
                  Create account
                </Link>
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
}

export default Navbar;
