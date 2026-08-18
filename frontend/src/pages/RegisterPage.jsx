import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Authentication asli akan kita sambungkan ke Supabase nanti.
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[-150px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-tight">
                Privy<span className="text-cyan-300">Guard</span>
              </div>

              <div className="text-[9px] font-medium uppercase tracking-[0.25em] text-slate-500">
                Digital Privacy
              </div>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          {/* Register card */}
          <div className="order-2 mx-auto w-full max-w-md lg:order-1">
            <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-7 shadow-2xl shadow-black/20 sm:p-9">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <ShieldCheck className="h-5 w-5 text-cyan-300" />
              </div>

              <h2 className="mt-6 text-2xl font-bold">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start taking control of your digital privacy.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/40"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/40"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 pr-20 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-cyan-400/40"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    name="agree"
                    type="checkbox"
                    required
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-cyan-300"
                  />

                  <span className="text-xs leading-5 text-slate-500">
                    I understand that PrivyGuard is designed to help me
                    protect sensitive information before sharing it.
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Create Account
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* Right information */}
          <div className="order-1 lg:order-2">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-4 py-2 text-xs font-medium text-cyan-200">
              <Sparkles className="h-3.5 w-3.5" />
              YOUR PRIVACY JOURNEY STARTS HERE
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-[-0.04em]">
              Make privacy a habit,{" "}
              <span className="text-cyan-300">not an afterthought.</span>
            </h1>

            <p className="mt-6 max-w-xl leading-7 text-slate-400">
              Create your PrivyGuard account and get a dedicated space to
              analyze, understand, and protect the information you share.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                {
                  title: "Detect",
                  description: "Find sensitive information before sharing.",
                },
                {
                  title: "Understand",
                  description: "Know why your data could be risky.",
                },
                {
                  title: "Protect",
                  description: "Take action with intelligent recommendations.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10">
                    <Check className="h-4 w-4 text-cyan-300" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;