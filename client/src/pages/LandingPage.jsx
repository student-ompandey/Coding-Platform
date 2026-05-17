import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LandingNavbar } from "@/layouts/LandingNavbar";
import { Footer } from "@/layouts/Footer";
import { Button } from "@/components/ui/button";
import { Code2, Trophy, Users, Zap, Shield, Globe, BarChart3, ArrowRight, Play, CheckCircle, Star, ChevronRight, Terminal, Cpu, Braces } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-50px" }, transition: { duration: 0.6 } };
const stagger = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

const features = [
  { icon: Terminal, title: "Monaco Code Editor", desc: "VS Code-quality editor with IntelliSense and multi-language support." },
  { icon: Cpu, title: "Instant Judging", desc: "Lightning-fast code evaluation with support for 40+ languages." },
  { icon: Trophy, title: "Live Contests", desc: "Compete in real-time with live leaderboards and instant rankings." },
  { icon: Shield, title: "Anti-Cheat System", desc: "Advanced plagiarism detection and tab-switch monitoring." },
  { icon: BarChart3, title: "Detailed Analytics", desc: "Track progress with submission history and performance insights." },
  { icon: Globe, title: "Global Community", desc: "Join thousands of competitive programmers worldwide." },
];

const steps = [
  { num: "01", title: "Sign Up", desc: "Create your free account in seconds.", icon: Users },
  { num: "02", title: "Join a Contest", desc: "Browse and register for contests with one click.", icon: Play },
  { num: "03", title: "Code & Compete", desc: "Solve problems and see instant results.", icon: Braces },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <LandingNavbar />
      <section className="relative pt-28 pb-20 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/8 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
                <Zap className="size-3" /> Platform v2.0 — Now with Monaco Editor
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                Code. Compete.<br /><span className="gradient-text">Conquer.</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mb-8">
                The ultimate competitive programming platform built for students. Real-time contests, instant judging, and a premium coding experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild className="bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white border-0 shadow-xl shadow-cyan-500/25 h-12 px-8 text-base gap-2">
                  <Link to="/register">Start Coding Free <ArrowRight className="size-4" /></Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="h-12 px-8 text-base gap-2">
                  <Link to="/contests"><Play className="size-4" /> View Contests</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
