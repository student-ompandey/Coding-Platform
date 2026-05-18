import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { AdminRoute } from "@/components/ProtectedRoute";
import AdminRoutes from "@/routes/AdminRoutes";
import { Toaster } from "sonner";
import Login from "@/pages/Login";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<AdminRoute><AdminRoutes /></AdminRoute>} />
          </Routes>
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
