import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import FrontendRoutes from "@/pages/FrontendRoutes";
import { Toaster } from "sonner";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
