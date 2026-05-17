import { Link } from "react-router-dom";
import { Code2, Terminal, MessageCircle, Briefcase, Mail } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Contests", href: "/contests" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Problems", href: "/problems" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socials = [
  { icon: Terminal, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Briefcase, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "#", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-muted/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="size-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center">
                <Code2 className="size-4 text-white" />
              </div>
              <span className="text-xl font-bold">Code<span className="gradient-text">Arena</span></span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
              The ultimate competitive programming platform for students. Code, compete, and conquer.
            </p>
            <div className="flex items-center gap-4">
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="text-muted-foreground hover:text-primary transition-colors" title={s.label}>
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CodeArena. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">v2.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
