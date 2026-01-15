export function Footer() {
  return (
    <footer className="bg-primary dark:bg-[color-dark-2] text-white py-4 mt-auto border-t border-white/20 dark:border-[color-dark-3]">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} React Frontend Template
        </p>
      </div>
    </footer>
  );
}

export default Footer;
