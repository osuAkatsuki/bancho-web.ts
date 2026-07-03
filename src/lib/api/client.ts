import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api/http";
import type {
  Beatmap,
  Clan,
  LeaderboardEntry,
  MapScore,
  MostPlayedMap,
  Player,
  PlayerScore,
  PlayerStats,
  PlayerStatus,
  SearchPlayer,
  ServerMeta,
  ServerStats,
} from "@/lib/api/types";

export type LeaderboardSort =
  | "pp"
  | "rscore"
  | "tscore"
  | "acc"
  | "plays"
  | "playtime";

export type ScoreScope = "best" | "recent";

export const api = {
  fetchServerStats: () => apiGet<ServerStats>("/v2/server/stats"),

  fetchServerMeta: () => apiGet<ServerMeta>("/v2/server/meta"),

  fetchLeaderboard: (
    mode: number,
    options: {
      sort?: LeaderboardSort;
      country?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) =>
    apiGet<LeaderboardEntry[]>(`/v2/leaderboards/${mode}`, {
      sort: options.sort,
      country: options.country,
      page: options.page,
      page_size: options.pageSize,
    }),

  fetchPlayer: (playerId: number) => apiGet<Player>(`/v2/players/${playerId}`),

  fetchPlayerStatus: (playerId: number) =>
    apiGet<PlayerStatus>(`/v2/players/${playerId}/status`),

  fetchPlayerStats: (playerId: number) =>
    apiGet<PlayerStats[]>(`/v2/players/${playerId}/stats`),

  fetchPlayerScores: (
    playerId: number,
    options: { scope: ScoreScope; mode: number; limit?: number },
  ) =>
    apiGet<PlayerScore[]>(`/v2/players/${playerId}/scores`, {
      scope: options.scope,
      mode: options.mode,
      limit: options.limit,
    }),

  fetchPlayerMostPlayed: (
    playerId: number,
    options: { mode: number; limit?: number },
  ) =>
    apiGet<MostPlayedMap[]>(`/v2/players/${playerId}/most_played`, {
      mode: options.mode,
      limit: options.limit,
    }),

  searchPlayers: (query: string) =>
    apiGet<SearchPlayer[]>("/v2/players/search", { q: query }),

  fetchBeatmap: (mapId: number) => apiGet<Beatmap>(`/v2/maps/${mapId}`),

  fetchBeatmapScores: (mapId: number, options: { mode: number; limit?: number }) =>
    apiGet<MapScore[]>(`/v2/maps/${mapId}/scores`, {
      mode: options.mode,
      limit: options.limit,
    }),

  fetchClans: (options: { page?: number; pageSize?: number } = {}) =>
    apiGet<Clan[]>("/v2/clans", {
      page: options.page,
      page_size: options.pageSize,
    }),

  fetchClan: (clanId: number) => apiGet<Clan>(`/v2/clans/${clanId}`),

  fetchClanMembers: (clanId: number) =>
    apiGet<Player[]>("/v2/players", { clan_id: clanId, page_size: 100 }),

  registerAccount: (args: {
    username: string;
    email: string;
    password: string;
    captchaToken: string | null;
  }) =>
    apiPost<Player>("/v2/accounts", {
      username: args.username,
      email: args.email,
      password: args.password,
      captcha_token: args.captchaToken,
    }),

  createSession: (args: { username: string; password: string }) =>
    apiPost<Player>("/v2/sessions", args),

  fetchCurrentSession: () => apiGet<Player>("/v2/sessions/current"),

  deleteCurrentSession: () => apiDelete<null>("/v2/sessions/current"),

  uploadAvatar: (playerId: number, file: File) => {
    const form = new FormData();
    form.append("avatar_file", file);
    return apiPut<null>(`/v2/players/${playerId}/avatar`, form);
  },
};
