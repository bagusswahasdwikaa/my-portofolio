import { CONTACT_LINKS } from "../config/profile";

const SocialLinks = () => (
  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
    {CONTACT_LINKS.map(({ name, label, detail, url, icon: Icon }) => (
      <a
        key={name}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group flex min-h-16 min-w-0 items-center gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-raised)] p-4 text-left transition-colors duration-200 hover:border-[var(--accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--text)]">
            {name}
          </span>
          <span className="block truncate text-xs text-[var(--muted)]">
            {detail}
          </span>
        </span>
      </a>
    ))}
  </div>
);

export default SocialLinks;
