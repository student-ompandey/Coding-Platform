import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export function LandingNavbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Code2 className="size-4 text-white" />
            </div>
            <span className="text-xl font-bold">Code<span className="gradient-text">Arena</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-cyan-500/25" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
