import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar } from "@/components/Avatar";
import { api } from "@/lib/api/client";

function useDebounced<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export function PlayerSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounced(query.trim(), 300);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: results } = useQuery({
    queryKey: ["player-search", debouncedQuery],
    queryFn: () => api.searchPlayers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    select: (envelope) => envelope.data.slice(0, 8),
  });

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToPlayer(playerId: number) {
    setOpen(false);
    setQuery("");
    navigate(`/u/${playerId}`);
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="search"
        value={query}
        placeholder="Search players..."
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results?.length) {
            goToPlayer(results[0].id);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        className="w-full rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {open && debouncedQuery.length >= 2 && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-line bg-surface-2 shadow-xl">
          {results === undefined ? (
            <p className="px-4 py-3 text-sm text-muted">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted">No players found.</p>
          ) : (
            <ul>
              {results.map((player) => (
                <li key={player.id}>
                  <button
                    type="button"
                    onClick={() => goToPlayer(player.id)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-surface-3"
                  >
                    <Avatar
                      playerId={player.id}
                      className="h-7 w-7 rounded-md bg-surface-3 object-cover"
                    />
                    <span className="font-medium">{player.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
