/** Response models of bancho.py's v2 api. */

export interface Player {
  id: number;
  name: string;
  safe_name: string;
  priv: number;
  country: string;
  silence_end: number;
  donor_end: number;
  creation_time: number;
  latest_activity: number;
  clan_id: number;
  clan_priv: number;
  preferred_mode: number;
  play_style: number;
  custom_badge_name: string | null;
  custom_badge_icon: string | null;
  userpage_content: string | null;
}

export interface PlayerStatus {
  login_time: number;
  action: number;
  info_text: string;
  mode: number;
  mods: number;
  beatmap_id: number;
}

export interface PlayerStats {
  id: number;
  mode: number;
  tscore: number;
  rscore: number;
  pp: number;
  plays: number;
  playtime: number;
  acc: number;
  max_combo: number;
  total_hits: number;
  replay_views: number;
  xh_count: number;
  x_count: number;
  sh_count: number;
  s_count: number;
  a_count: number;
  /** 1-indexed global rank; 0 = unranked. */
  rank: number;
  /** 1-indexed country rank; 0 = unranked. */
  country_rank: number;
}

export interface SearchPlayer {
  id: number;
  name: string;
}

export interface LeaderboardEntry {
  rank: number;
  player_id: number;
  name: string;
  country: string;
  clan_id: number | null;
  clan_name: string | null;
  clan_tag: string | null;
  tscore: number;
  rscore: number;
  pp: number;
  acc: number;
  plays: number;
  playtime: number;
  max_combo: number;
  xh_count: number;
  x_count: number;
  sh_count: number;
  s_count: number;
  a_count: number;
}

export interface Beatmap {
  id: number;
  server: string;
  set_id: number;
  status: number;
  md5: string;
  artist: string;
  title: string;
  version: string;
  creator: string;
  filename: string;
  last_update: string;
  total_length: number;
  max_combo: number;
  frozen: boolean;
  plays: number;
  passes: number;
  mode: number;
  bpm: number;
  cs: number;
  ar: number;
  od: number;
  hp: number;
  diff: number;
}

/** Slimmer beatmap shape embedded in score listings. */
export interface ScoreBeatmap {
  id: number;
  set_id: number;
  md5: string;
  status: number;
  artist: string;
  title: string;
  version: string;
  creator: string;
  last_update: string;
  total_length: number;
  max_combo: number;
  plays: number;
  passes: number;
  mode: number;
  bpm: number;
  cs: number;
  ar: number;
  od: number;
  hp: number;
  diff: number;
}

export interface PlayerScore {
  id: number;
  map_md5: string;
  score: number;
  pp: number;
  acc: number;
  max_combo: number;
  mods: number;
  n300: number;
  n100: number;
  n50: number;
  nmiss: number;
  ngeki: number;
  nkatu: number;
  grade: string;
  status: number;
  mode: number;
  play_time: string;
  time_elapsed: number;
  perfect: boolean;
  beatmap: ScoreBeatmap | null;
}

export interface ScorePlayer {
  id: number;
  name: string;
  country: string;
  clan_id: number | null;
  clan_name: string | null;
  clan_tag: string | null;
}

export interface MapScore {
  map_md5: string;
  score: number;
  pp: number;
  acc: number;
  max_combo: number;
  mods: number;
  n300: number;
  n100: number;
  n50: number;
  nmiss: number;
  ngeki: number;
  nkatu: number;
  grade: string;
  status: number;
  mode: number;
  play_time: string;
  time_elapsed: number;
  perfect: boolean;
  player: ScorePlayer | null;
}

export interface MostPlayedMap {
  id: number;
  set_id: number;
  md5: string;
  status: number;
  artist: string;
  title: string;
  version: string;
  creator: string;
  plays: number;
}

export interface ServerStats {
  online_players: number;
  total_players: number;
}
