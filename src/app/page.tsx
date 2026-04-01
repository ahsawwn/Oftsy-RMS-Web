import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import {
  LayoutDashboard,
  Building,
  ShieldCheck,
  ArrowRight,
  Activity,
  Briefcase
} from "lucide-react";

export default function HomePage() {
  return (
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto border-b border-brand-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tighter text-2xl leading-none">Oftsy <span className="text-brand-primary">RMS</span></span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Realestate Management System</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Operational Engine for</span>
              <span className="text-xs font-semibold">ABH Holdings</span>
            </div>
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-secondary/30 border border-brand-secondary/50 text-xs font-bold text-foreground/80">
                <Activity size={14} className="text-green-500" />
                v1.0.4-STABLE RELEASE
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9]">
                Managing <br />
                <span className="text-brand-primary">Construction</span> <br />
                at Scale.
              </h1>

              <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-lg leading-relaxed">
                Oftsy RMS is the proprietary management backbone for <strong>ABH Holdings</strong>.
                Automating unit allocation, lead pipelines, and site-level financial oversight.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/login"
                    className="group px-8 py-4 bg-brand-primary hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  Access Portal
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <button className="px-8 py-4 bg-transparent hover:bg-brand-secondary/50 border border-brand-secondary/80 font-bold rounded-2xl transition-all">
                  Internal Documentation
                </button>
              </div>
            </div>

            {/* Side Info / Visuals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-brand-secondary/20 border border-brand-secondary/50 rounded-3xl space-y-4">
                <Building className="text-brand-primary" size={32} />
                <h3 className="font-bold text-xl">Site Management</h3>
                <p className="text-sm text-foreground/70">Automated tracking of construction milestones and material inventory.</p>
              </div>
              <div className="p-8 bg-brand-secondary/20 border border-brand-secondary/50 rounded-3xl space-y-4 mt-8">
                <ShieldCheck className="text-green-500" size={32} />
                <h3 className="font-bold text-xl">Audit Ready</h3>
                <p className="text-sm text-foreground/70">Every operational change is logged with IP and timestamp for security.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Sticky Footer */}
        <footer className="fixed bottom-0 w-full bg-background/80 backdrop-blur-md border-t border-brand-secondary/50 py-4">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 tracking-widest uppercase">
              <span>Product of Oftsy Systems</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span>Client: ABH Holdings</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-zinc-500">Node Cluster: South-01</span>
            </div>
          </div>
        </footer>
      </div>
  );
}