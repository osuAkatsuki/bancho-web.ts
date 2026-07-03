import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";

import { Flag } from "@/components/Flag";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { Pagination } from "@/components/Pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { api } from "@/lib/api/client";
import { isValidModeId, modeName } from "@/lib/gamemodes";
import {
  formatAccuracy,
  formatNumber,
  formatPerformance,
} from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

const PAGE_SIZE = 50;

export function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const modeParam = Number(searchParams.get("mode") ?? "0");
  const modeId = isValidModeId(modeParam) ? modeParam : 0;
  const pageParam = Number(searchParams.get("page") ?? "1");
  const page = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

  usePageTitle(`${modeName(modeId)} Leaderboard`);

  const { data, isPending, error } = useQuery({
    queryKey: ["leaderboard", modeId, page],
    queryFn: () =>
      api.fetchLeaderboard(modeId, { sort: "pp", page, pageSize: PAGE_SIZE }),
    select: (envelope) => envelope.data,
  });

  function updateParams(next: { mode?: number; page?: number }) {
    setSearchParams((params) => {
      if (next.mode !== undefined) {
        params.set("mode", String(next.mode));
        params.delete("page"); // mode change resets pagination
      }
      if (next.page !== undefined) {
        params.set("page", String(next.page));
      }
      return params;
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-sm text-muted">
          The top players on the server, ranked by performance points.
        </p>
      </div>

      <ModeSwitcher
        modeId={modeId}
        onChange={(mode) => updateParams({ mode })}
      />

      {isPending ? (
        <LoadingState label="Loading leaderboard..." />
      ) : error ? (
        <ErrorState error={error} />
      ) : data.length === 0 ? (
        <EmptyState label="No ranked players for this mode yet." />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 text-right">Rank</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3 text-right">Performance</th>
                  <th className="px-4 py-3 text-right">Accuracy</th>
                  <th className="px-4 py-3 text-right">Playcount</th>
                  <th className="hidden px-4 py-3 text-right sm:table-cell">
                    SS / S / A
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr
                    key={entry.player_id}
                    className="border-b border-line/50 last:border-b-0 hover:bg-surface-2"
                  >
                    <td className="px-4 py-2.5 text-right font-semibold text-muted">
                      #{entry.rank}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Flag countryCode={entry.country} />
                        {entry.clan_tag && (
                          <span className="text-xs font-semibold text-accent">
                            [{entry.clan_tag}]
                          </span>
                        )}
                        <Link
                          to={`/u/${entry.player_id}`}
                          className="font-medium hover:text-accent"
                        >
                          {entry.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-accent">
                      {formatPerformance(entry.pp)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted">
                      {formatAccuracy(entry.acc)}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted">
                      {formatNumber(entry.plays)}
                    </td>
                    <td className="hidden px-4 py-2.5 text-right text-xs text-muted sm:table-cell">
                      {formatNumber(entry.xh_count + entry.x_count)} /{" "}
                      {formatNumber(entry.sh_count + entry.s_count)} /{" "}
                      {formatNumber(entry.a_count)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            hasNextPage={data.length === PAGE_SIZE}
            onPageChange={(nextPage) => updateParams({ page: nextPage })}
          />
        </>
      )}
    </div>
  );
}
