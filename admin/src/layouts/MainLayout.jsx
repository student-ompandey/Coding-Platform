import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useSidebar } from "@/hooks/useSidebar";
import { Toaster } from "sonner";

export function MainLayout() {
  const { isOpen, toggle, close } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isOpen} onClose={close} />
      <div className="lg:pl-64">
        <Navbar onMenuClick={toggle} />
        <main className="p-4 lg:p-6 max-w-[1400px] mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: { background: "oklch(0.17 0.005 260)", border: "1px solid oklch(0.25 0.01 260)" },
        }}
      />
    </div>
  );
}
