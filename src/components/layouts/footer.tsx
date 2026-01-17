export function Footer() {
  return (
    <footer className="bg-primary mt-auto border-t border-white/20 py-4 text-white dark:border-[color-dark-3] dark:bg-[color-dark-2]">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} React Frontend Template
        </p>
      </div>
    </footer>
  );
}

export default Footer;
