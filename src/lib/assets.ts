import { env } from "@/lib/env";

export function avatarUrl(playerId: number): string {
  return `${env.avatarsBaseUrl}/${playerId}`;
}

/** Full .osr replay download, served by bancho.py. */
export function replayDownloadUrl(scoreId: number): string {
  return `${env.apiBaseUrl}/v2/scores/${scoreId}/replay`;
}

/** Wide beatmap set cover, served from osu!'s asset cdn. */
export function beatmapCoverUrl(setId: number): string {
  return `https://assets.ppy.sh/beatmaps/${setId}/covers/cover.jpg`;
}

/** Small beatmap set thumbnail, served from osu!'s asset cdn. */
export function beatmapThumbnailUrl(setId: number): string {
  return `https://b.ppy.sh/thumb/${setId}l.jpg`;
}

export function flagUrl(countryCode: string): string {
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
}
