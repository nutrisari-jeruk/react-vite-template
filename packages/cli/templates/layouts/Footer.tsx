export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/20 bg-blue-600 py-4 text-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm text-pretty">
          &copy; {new Date().getFullYear()} React Frontend Template
        </p>
      </div>
    </footer>
  );
}

export default Footer;
