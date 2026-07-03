import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { BeatmapPage } from "@/pages/BeatmapPage";
import { ClanPage } from "@/pages/ClanPage";
import { ClansPage } from "@/pages/ClansPage";
import { HomePage } from "@/pages/HomePage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlayerPage } from "@/pages/PlayerPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { SettingsPage } from "@/pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/clans" element={<ClansPage />} />
        <Route path="/clan/:clanId" element={<ClanPage />} />
        <Route path="/u/:playerId" element={<PlayerPage />} />
        <Route path="/b/:mapId" element={<BeatmapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
