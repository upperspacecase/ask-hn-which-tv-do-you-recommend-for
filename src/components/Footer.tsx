const LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "mailto:hello@offlinetvlist.com" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
];

export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 pb-14 pt-6">
      <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-line pt-8">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="cursor-pointer text-base font-medium text-muted transition-colors duration-200 hover:text-ink-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {link.label}
          </a>
        ))}
      </nav>
      <p className="mt-6 text-base text-muted">
        This page loads no analytics, third-party fonts, or pixels. View
        source.
      </p>
    </footer>
  );
}
