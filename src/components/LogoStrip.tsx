function YBox() {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className="mr-1.5 inline-block align-[-3px]"
    >
      <rect width="20" height="20" rx="3" fill="currentColor" />
      <path
        d="M6 4.5h2.3l1.7 3.6 1.7-3.6H14l-3 5.6v4.9H9V10.1L6 4.5z"
        fill="#f8fafc"
      />
    </svg>
  );
}

const COMMUNITIES = [
  { name: "Hacker News", icon: true },
  { name: "r/privacy" },
  { name: "r/selfhosted" },
  { name: "r/jellyfin" },
  { name: "r/hometheater" },
  { name: "r/homelab" },
  { name: "Privacy Guides" },
];

export default function LogoStrip() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
      <p className="text-base text-muted">
        Built for the engineers already asking this question on
      </p>
      <ul className="mt-7 flex flex-wrap items-center gap-x-9 gap-y-4 text-ink-strong">
        {COMMUNITIES.map((c) => (
          <li
            key={c.name}
            className="flex items-center text-base font-bold tracking-tight opacity-80"
          >
            {c.icon ? <YBox /> : null}
            {c.name}
          </li>
        ))}
      </ul>
    </section>
  );
}
