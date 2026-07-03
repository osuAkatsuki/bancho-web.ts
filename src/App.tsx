import { Route, Routes } from "react-router-dom";

import { Layout } from "@/components/layout/Layout";
import { BeatmapPage } from "@/pages/BeatmapPage";
import { HomePage } from "@/pages/HomePage";
import { LeaderboardPage } from "@/pages/LeaderboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PlayerPage } from "@/pages/PlayerPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/u/:playerId" element={<PlayerPage />} />
        <Route path="/b/:mapId" element={<BeatmapPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
