import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api/client";
import { env } from "@/lib/env";

export function Footer() {
  // sourced from the server (bancho.py's DISCORD_INVITE setting) so
  // operators can change it without rebuilding the frontend; hidden
  // when unset or when the backend doesn't have the endpoint yet
  const { data: meta } = useQuery({
    queryKey: ["server-meta"],
    queryFn: () => api.fetchServerMeta(),
    staleTime: Infinity,
    retry: false,
    select: (envelope) => envelope.data,
  });

  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted sm:flex-row">
        <span>
          {env.appName} — running on{" "}
          <a
            href="https://github.com/osuAkatsuki/bancho.py"
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            bancho.py
          </a>
          {meta?.discord_invite && (
            <>
              {" · "}
              <a
                href={meta.discord_invite}
                target="_blank"
                rel="noreferrer"
                className="text-accent hover:text-accent-hover"
              >
                Discord
              </a>
            </>
          )}
        </span>
        <span>
          osu! is a trademark of ppy Pty Ltd. This server is not affiliated
          with osu!.
        </span>
      </div>
    </footer>
  );
}
