import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import FrontendRoutes from "@/routes/FrontendRoutes";
import { Toaster } from "sonner";
import { NotificationListener } from "@/components/shared/NotificationListener";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationListener />
        <TooltipProvider>
          <Routes>
            <Route path="/*" element={<FrontendRoutes />} />
          </Routes>
          <Toaster richColors position="top-center" />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
