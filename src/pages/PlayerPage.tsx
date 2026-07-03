import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Avatar } from "@/components/Avatar";
import { Flag } from "@/components/Flag";
import { GradeBadge } from "@/components/GradeBadge";
import { ModBadges } from "@/components/ModBadges";
import { ModeSwitcher } from "@/components/ModeSwitcher";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { api, type ScoreScope } from "@/lib/api/client";
import { ApiError } from "@/lib/api/http";
import type { MostPlayedMap, PlayerScore } from "@/lib/api/types";
import {
  formatAccuracy,
  formatNumber,
  formatPerformance,
  formatPlaytime,
  formatTimeAgo,
} from "@/lib/format";
import { usePageTitle } from "@/lib/usePageTitle";

type ScoresTab = ScoreScope | "most_played";

const SCORE_TABS: { tab: ScoresTab; label: string }[] = [
  { tab: "best", label: "Best scores" },
  { tab: "recent", label: "Recent scores" },
  { tab: "most_played", label: "Most played" },
];

export function PlayerPage() {
  const params = useParams();
  const playerId = Number(params.playerId);

  const [modeId, setModeId] = useState(0);
  const [tab, setTab] = useState<ScoresTab>("best");

  const playerQuery = useQuery({
    queryKey: ["player", playerId],
    queryFn: () => api.fetchPlayer(playerId),
    enabled: Number.isInteger(playerId) && playerId > 0,
    select: (envelope) => envelope.data,
  });

  const statsQuery = useQuery({
    queryKey: ["player-stats", playerId],
    queryFn: () => api.fetchPlayerStats(playerId),
    enabled: playerQuery.isSuccess,
    select: (envelope) => envelope.data,
  });

  const statusQuery = useQuery({
    queryKey: ["player-status", playerId],
    queryFn: () => api.fetchPlayerStatus(playerId),
    enabled: playerQuery.isSuccess,
    refetchInterval: 60_000,
    retry: false,
    select: (envelope) => envelope.data,
  });

  usePageTitle(playerQuery.data?.name);

  if (!Number.isInteger(playerId) || playerId <= 0) {
    return <ErrorState error={new ApiError("Invalid player id.", 400)} />;
  }
  if (playerQuery.isPending) {
    return <LoadingState label="Loading player..." />;
  }
  if (playerQuery.error) {
    return <ErrorState error={playerQuery.error} />;
  }

  const player = playerQuery.data;
  const stats = statsQuery.data?.find((entry) => entry.mode === modeId);
  const isOnline = statusQuery.isSuccess;
  const isRestricted = (player.priv & 1) === 0;

  return (
    <div className="space-y-6">
      {/* profile header */}
      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="h-24 bg-gradient-to-r from-accent/40 via-purple-500/30 to-sky-500/30" />
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-5">
          <div className="flex items-end gap-4">
            <Avatar
              playerId={player.id}
              alt={`${player.name}'s avatar`}
              className="-mt-10 h-24 w-24 rounded-2xl border-4 border-surface bg-surface-2 object-cover"
            />
            <div className="pb-1">
              <div className="flex items-center gap-2.5">
                <Flag countryCode={player.country} className="h-5 w-7" />
                <h1 className="text-2xl font-bold">{player.name}</h1>
                <span
                  title={isOnline ? "Online" : "Offline"}
                  className={`h-3 w-3 rounded-full ${
                    isOnline ? "bg-emerald-400" : "bg-surface-3"
                  }`}
                />
              </div>
              <p className="mt-1 text-sm text-muted">
                {isOnline
                  ? "Currently online"
                  : `Last seen ${formatTimeAgo(player.latest_activity)}`}
                {" · "}joined {formatTimeAgo(player.creation_time)}
              </p>
            </div>
          </div>

          <div className="flex gap-6 pb-1 text-right">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Global rank
              </p>
              <p className="text-2xl font-bold text-accent">
                {stats && stats.rank > 0 ? `#${formatNumber(stats.rank)}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">
                Country rank
              </p>
              <p className="text-2xl font-bold">
                {stats && stats.country_rank > 0
                  ? `#${formatNumber(stats.country_rank)}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isRestricted && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
          This account is restricted; its scores are hidden from
          leaderboards.
        </div>
      )}

      <ModeSwitcher modeId={modeId} onChange={setModeId} />

      {/* stats grid */}
      {stats ? (
        <>
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="Performance"
              value={formatPerformance(stats.pp)}
              highlight
            />
            <StatCard label="Accuracy" value={formatAccuracy(stats.acc)} />
            <StatCard label="Playcount" value={formatNumber(stats.plays)} />
            <StatCard label="Playtime" value={formatPlaytime(stats.playtime)} />
            <StatCard
              label="Ranked score"
              value={formatNumber(stats.rscore)}
            />
            <StatCard label="Total score" value={formatNumber(stats.tscore)} />
            <StatCard label="Max combo" value={`${formatNumber(stats.max_combo)}x`} />
            <StatCard
              label="Replays watched"
              value={formatNumber(stats.replay_views)}
            />
          </section>

          {/* grade counts */}
          <section className="flex flex-wrap items-center gap-6 rounded-2xl border border-line bg-surface px-6 py-4">
            <GradeCount grade="XH" count={stats.xh_count} />
            <GradeCount grade="X" count={stats.x_count} />
            <GradeCount grade="SH" count={stats.sh_count} />
            <GradeCount grade="S" count={stats.s_count} />
            <GradeCount grade="A" count={stats.a_count} />
          </section>
        </>
      ) : statsQuery.isPending ? (
        <LoadingState label="Loading stats..." />
      ) : (
        <EmptyState label="No stats for this mode." />
      )}

      {/* score listings */}
      <section className="space-y-4">
        <div className="flex rounded-xl bg-surface p-1">
          {SCORE_TABS.map((entry) => (
            <button
              key={entry.tab}
              type="button"
              onClick={() => setTab(entry.tab)}
              className={`flex-1 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === entry.tab
                  ? "bg-surface-3 text-slate-100"
                  : "text-muted hover:text-slate-100"
              }`}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {tab === "most_played" ? (
          <MostPlayedList playerId={playerId} modeId={modeId} />
        ) : (
          <ScoreList playerId={playerId} modeId={modeId} scope={tab} />
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
      <p
        className={`mt-1 text-lg font-bold ${highlight ? "text-accent" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function GradeCount({ grade, count }: { grade: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <GradeBadge grade={grade} />
      <span className="text-sm text-muted">{formatNumber(count)}</span>
    </div>
  );
}

function ScoreList({
  playerId,
  modeId,
  scope,
}: {
  playerId: number;
  modeId: number;
  scope: ScoreScope;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: ["player-scores", playerId, modeId, scope],
    queryFn: () =>
      api.fetchPlayerScores(playerId, { scope, mode: modeId, limit: 50 }),
    select: (envelope) => envelope.data,
  });

  if (isPending) return <LoadingState label="Loading scores..." />;
  if (error) return <ErrorState error={error} />;
  if (data.length === 0) {
    return (
      <EmptyState
        label={
          scope === "best"
            ? "No ranked scores for this mode yet."
            : "No recent scores for this mode."
        }
      />
    );
  }

  return (
    <ul className="space-y-1.5">
      {data.map((score) => (
        <ScoreRow key={score.id} score={score} />
      ))}
    </ul>
  );
}

function ScoreRow({ score }: { score: PlayerScore }) {
  const beatmap = score.beatmap;
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 hover:bg-surface-2">
      <GradeBadge grade={score.grade} />

      <div className="min-w-0 flex-1">
        {beatmap ? (
          <Link
            to={`/b/${beatmap.id}`}
            className="block truncate font-medium hover:text-accent"
          >
            {beatmap.artist} - {beatmap.title}{" "}
            <span className="text-muted">[{beatmap.version}]</span>
          </Link>
        ) : (
          <span className="block truncate font-medium text-muted">
            Unknown beatmap
          </span>
        )}
        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
          <span>{formatTimeAgo(score.play_time)}</span>
          <ModBadges mods={score.mods} />
        </div>
      </div>

      <div className="text-right">
        <p className="font-bold text-accent">{formatPerformance(score.pp)}</p>
        <p className="text-xs text-muted">
          {formatAccuracy(score.acc)} · {formatNumber(score.max_combo)}x
        </p>
      </div>
    </li>
  );
}

function MostPlayedList({
  playerId,
  modeId,
}: {
  playerId: number;
  modeId: number;
}) {
  const { data, isPending, error } = useQuery({
    queryKey: ["player-most-played", playerId, modeId],
    queryFn: () =>
      api.fetchPlayerMostPlayed(playerId, { mode: modeId, limit: 50 }),
    select: (envelope) => envelope.data,
  });

  if (isPending) return <LoadingState label="Loading maps..." />;
  if (error) return <ErrorState error={error} />;
  if (data.length === 0) {
    return <EmptyState label="No plays for this mode yet." />;
  }

  return (
    <ul className="space-y-1.5">
      {data.map((map) => (
        <MostPlayedRow key={map.id} map={map} />
      ))}
    </ul>
  );
}

function MostPlayedRow({ map }: { map: MostPlayedMap }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-2.5 hover:bg-surface-2">
      <div className="min-w-0 flex-1">
        <Link
          to={`/b/${map.id}`}
          className="block truncate font-medium hover:text-accent"
        >
          {map.artist} - {map.title}{" "}
          <span className="text-muted">[{map.version}]</span>
        </Link>
        <p className="mt-0.5 text-xs text-muted">mapped by {map.creator}</p>
      </div>
      <div className="text-right">
        <p className="font-bold">{formatNumber(map.plays)}</p>
        <p className="text-xs text-muted">plays</p>
      </div>
    </li>
  );
}
