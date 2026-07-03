import { Link, NavLink } from "react-router-dom";

import { PlayerSearch } from "@/components/PlayerSearch";
import { UserMenu } from "@/components/layout/UserMenu";
import { env } from "@/lib/env";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/clans", label: "Clans" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden>
            <circle cx="32" cy="32" r="30" fill="#ff66aa" />
            <circle
              cx="32"
              cy="32"
              r="21"
              fill="none"
              stroke="#fff"
              strokeWidth="5"
            />
            <circle cx="32" cy="32" r="8" fill="#fff" />
          </svg>
          <span className="text-lg font-bold tracking-tight">
            {env.appName}
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-surface-2 hover:text-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="w-full max-w-xs">
            <PlayerSearch />
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
