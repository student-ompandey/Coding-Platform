import { Routes, Route } from "react-router-dom";
import { ParticipantLayout } from "@/layouts/ParticipantLayout";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import ContestPage from "@/pages/ContestPage";
import Workspace from "@/pages/Workspace";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function FrontendRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes without Layout */}
      <Route 
        path="/problem/:id" 
        element={
          <ProtectedRoute>
            <Workspace />
          </ProtectedRoute>
        } 
      />

      {/* Protected Participant Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <ParticipantLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/contests" element={<ContestPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
