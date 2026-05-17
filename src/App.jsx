import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import UsersPage from "@/pages/Users";
import QuestionsPage from "@/pages/Questions";
import SubmissionsPage from "@/pages/Submissions";
import LeaderboardPage from "@/pages/Leaderboard";
import AnnouncementsPage from "@/pages/Announcements";
import ContestControlPage from "@/pages/ContestControl";
import SettingsPage from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/submissions" element={<SubmissionsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/contest-control" element={<ContestControlPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}
