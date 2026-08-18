import {
  ArrowRight,
  Check,
  ChevronRight,
  FileSearch,
  LockKeyhole,
  Menu,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: FileSearch,
    title: "Privacy Scanner",
    description:
      "Detect sensitive information hidden inside screenshots and documents before you share them.",
  },
  {
    icon: Sparkles,
    title: "AI Risk Analysis",
    description:
      "Understand what makes your information risky with intelligent privacy analysis and recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy Protection",
    description:
      "Protect sensitive information by masking exposed data before your file reaches the public.",
  },
];

const steps = [
  {
    number: "01",
    title: "Scan",
    description:
      "Upload a screenshot or document you are about to share.",
  },
  {
    number: "02",
    title: "Analyze",
    description:
      "PrivyGuard identifies sensitive information and evaluates the privacy risk.",
  },
  {
    number: "03",
    title: "Protect",
    description:
      "Review the findings and create a safer version of your file.",
  },
];

function LandingPage() {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });

    setMobileMenu(false);
  };

  const goToRegister = () => {
    setMobileMenu(false);
    navigate("/register");
  };

  const goToLogin = () => {
    setMobileMenu(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070a11] text-white">
      {/* =========================================================
          BACKGROUND GLOW
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute right-[-200px] top-[500px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute left-[-250px] top-[900px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070a11]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* LOGO */}
          <button
            type="button"
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="text-left">
              <div className="text-lg font-bold tracking-tight">
                Privy<span className="text-cyan-300">Guard</span>
              </div>

              <div className="text-[9px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Digital Privacy
              </div>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection("features")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Features
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("how-it-works")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How It Works
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("security")}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Security
            </button>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-6 md:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-400 transition hover:text-white"
            >
              Sign In
            </Link>

            <button
              type="button"
              onClick={goToRegister}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenu((previous) => !previous)}
            className="rounded-lg border border-white/10 p-2 text-slate-300 md:hidden"
          >
            {mobileMenu ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="border-t border-white/[0.06] bg-[#070a11] px-6 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-left text-sm text-slate-300"
              >
                Features
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-sm text-slate-300"
              >
                How It Works
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("security")}
                className="text-left text-sm text-slate-300"
              >
                Security
              </button>

              <button
                type="button"
                onClick={goToLogin}
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={goToRegister}
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}
        <section id="home" className="relative">
          <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-32 lg:pt-28">
            {/* HERO COPY */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-medium text-cyan-200">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.8)]" />

                AI-POWERED DIGITAL PRIVACY
              </div>

              <h1 className="max-w-4xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Know what you{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  share.
                </span>
                <br />
                Protect what matters.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                PrivyGuard helps you detect sensitive information, understand
                your privacy risk, and protect your data before it gets shared.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={goToRegister}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Scan Your Data

                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("how-it-works")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  See How It Works

                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  Privacy-first
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  AI-assisted analysis
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan-300" />
                  Built for safer sharing
                </div>
              </div>
            </div>

            {/* =====================================================
                DASHBOARD VISUAL
            ===================================================== */}
            <div className="relative">
              <div className="absolute -inset-10 rounded-full bg-cyan-400/10 blur-[90px]" />

              <div className="relative rounded-3xl border border-white/10 bg-white/[0.035] p-3 shadow-2xl shadow-cyan-950/20">
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0b1019]">
                  {/* FAKE BROWSER HEADER */}
                  <div className="flex h-12 items-center gap-2 border-b border-white/[0.06] px-4">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />

                    <div className="ml-4 flex-1 rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-1.5 text-[10px] text-slate-600">
                      app.privyguard.local/scanner
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* HEADER */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                          Privacy Risk
                        </p>

                        <h3 className="mt-2 text-xl font-semibold">
                          Document Analysis
                        </h3>
                      </div>

                      <div className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-300">
                        HIGH RISK
                      </div>
                    </div>

                    {/* RISK SCORE */}
                    <div className="mt-8 flex items-center gap-7">
                      <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-8 border-red-400/10">
                        <div className="absolute inset-[-8px] rounded-full border-8 border-transparent border-t-red-400 border-r-red-400" />

                        <div className="text-center">
                          <div className="text-4xl font-bold tracking-tight">
                            82
                          </div>

                          <div className="text-[9px] uppercase tracking-widest text-slate-500">
                            Score
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        {[
                          ["Email Address", "High"],
                          ["Phone Number", "High"],
                          ["Home Address", "Medium"],
                          ["Identity Data", "Critical"],
                        ].map(([label, risk]) => (
                          <div
                            key={label}
                            className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
                          >
                            <span className="text-xs text-slate-300">
                              {label}
                            </span>

                            <span
                              className={`text-[10px] font-semibold ${
                                risk === "Critical"
                                  ? "text-red-300"
                                  : risk === "High"
                                    ? "text-orange-300"
                                    : "text-yellow-300"
                              }`}
                            >
                              {risk}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI RECOMMENDATION */}
                    <div className="mt-7 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                      <div className="flex gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />

                        <div>
                          <p className="text-xs font-semibold text-cyan-200">
                            AI Recommendation
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-400">
                            Sensitive information was detected. Protect your
                            document before sharing it publicly.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* PROTECT BUTTON */}
                    <button
                      type="button"
                      onClick={goToRegister}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-slate-950 transition hover:bg-cyan-50"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Protect My Data
                    </button>
                  </div>
                </div>
              </div>

              {/* FLOATING BADGE */}
              <div className="absolute -bottom-5 -left-4 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#101620] px-4 py-3 shadow-xl sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10">
                  <LockKeyhole className="h-4 w-4 text-cyan-300" />
                </div>

                <div>
                  <p className="text-[10px] text-slate-500">
                    Protection Status
                  </p>

                  <p className="text-xs font-semibold text-white">
                    Ready to Protect
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            TRUST BAR
        ========================================================= */}
        <section className="border-y border-white/[0.06] bg-white/[0.015]">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-600">
              Built around safer digital sharing
            </p>

            <div className="flex flex-wrap gap-5 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-cyan-300" />
                Privacy First
              </span>

              <span className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-cyan-300" />
                Secure by Design
              </span>

              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-300" />
                AI Assisted
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            FEATURES
        ========================================================= */}
        <section
          id="features"
          className="scroll-mt-24 py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Core capabilities
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need to share with confidence.
              </h2>

              <p className="mt-5 leading-7 text-slate-400">
                PrivyGuard turns privacy protection into a simple workflow:
                detect the risk, understand it, and take action.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/[0.07]">
                      <Icon className="h-5 w-5 text-cyan-300" />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {feature.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-xs font-medium text-cyan-300 opacity-0 transition group-hover:opacity-100">
                      Explore capability
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}
        <section
          id="how-it-works"
          className="scroll-mt-24 border-y border-white/[0.06] bg-white/[0.015] py-24 lg:py-32"
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Simple by design
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From exposed to protected in three steps.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                No complicated security workflow. PrivyGuard helps you
                understand your digital exposure and act before you share.
              </p>
            </div>

            <div className="relative mt-16 grid gap-8 md:grid-cols-3">
              {/* CONNECTING LINE */}
              <div className="absolute left-[16.66%] right-[16.66%] top-8 hidden border-t border-dashed border-white/10 md:block" />

              {steps.map((step) => (
                <div
                  key={step.number}
                  className="relative text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#0b1019] text-sm font-bold text-cyan-300 shadow-xl shadow-cyan-950/20">
                    {step.number}
                  </div>

                  <h3 className="mt-7 text-lg font-semibold">
                    {step.title}
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECURITY
        ========================================================= */}
        <section
          id="security"
          className="scroll-mt-24 py-24 lg:py-32"
        >
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                Privacy by design
              </p>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Your data deserves more than an afterthought.
              </h2>

              <p className="mt-5 max-w-xl leading-8 text-slate-400">
                PrivyGuard is designed around a simple principle: help users
                understand what information they are exposing before it becomes
                a problem.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Sensitive information detection",
                  "Risk-based privacy assessment",
                  "Actionable AI recommendations",
                  "Protected file generation",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-300"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-400/10">
                      <Check className="h-3.5 w-3.5 text-cyan-300" />
                    </div>

                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.025] p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10">
                    <ShieldCheck className="h-7 w-7 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                      Privacy status
                    </p>

                    <p className="mt-1 text-xl font-semibold">
                      Protection enabled
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  {[
                    ["Identity data", "Protected"],
                    ["Contact information", "Protected"],
                    ["Document exposure", "Monitored"],
                  ].map(([label, status]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-4 py-4"
                    >
                      <span className="text-sm text-slate-400">
                        {label}
                      </span>

                      <span className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />

                        {status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                  <p className="text-xs leading-6 text-slate-400">
                    <span className="font-semibold text-cyan-200">
                      Privacy insight:
                    </span>{" "}
                    The safest data is the data you intentionally choose to
                    share.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================= */}
        <section
          id="cta"
          className="scroll-mt-24 pb-24 lg:pb-32"
        >
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] via-white/[0.03] to-violet-400/[0.08] px-7 py-14 text-center sm:px-12">
              <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-[80px]" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <ShieldCheck className="h-7 w-7 text-cyan-300" />
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                  Take control of your digital privacy.
                </h2>

                <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-400">
                  Before you share your next document, screenshot, or piece of
                  information, know exactly what you are exposing.
                </p>

                <button
                  type="button"
                  onClick={goToRegister}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-7 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Start Protecting Your Data

                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
            </div>

            <span className="text-sm font-semibold">
              Privy<span className="text-cyan-300">Guard</span>
            </span>
          </div>

          <p className="text-xs text-slate-600">
            © 2026 PrivyGuard. Know what you share. Protect what matters.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;