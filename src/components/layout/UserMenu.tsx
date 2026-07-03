import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Avatar } from "@/components/Avatar";
import { useAuth } from "@/lib/auth";

export function UserMenu() {
  const { player, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  if (isLoading) {
    return <span className="h-8 w-8 rounded-lg bg-surface-2" />;
  }

  if (!player) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-2 hover:text-slate-100"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="whitespace-nowrap rounded-lg bg-accent px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-surface-2"
      >
        <Avatar
          playerId={player.id}
          className="h-8 w-8 rounded-lg bg-surface-2 object-cover"
        />
        <span className="hidden text-sm font-medium sm:block">
          {player.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-surface-2 shadow-xl">
          <Link
            to={`/u/${player.id}`}
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm hover:bg-surface-3"
          >
            My profile
          </Link>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await logout();
              navigate("/");
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-red-300 hover:bg-surface-3"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
