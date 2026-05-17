import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ParticipantLayout } from "@/components/layout/ParticipantLayout";
import LandingPage from "@/pages/LandingPage";

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<ParticipantLayout />}>
            {/* Will add more routes here soon */}
          </Route>
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}
