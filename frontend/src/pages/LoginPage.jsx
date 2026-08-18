import { ArrowLeft, LockKeyhole, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Untuk sementara kita arahkan ke dashboard.
    // Authentication backend akan kita sambungkan setelah UI selesai.
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-white">
      {/* HEADER */}
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
            </div>

            <div className="text-lg font-bold">
              Privy<span className="text-cyan-300">Guard</span>
            </div>
          </Link>

          {/* BACK TO HOME */}
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* LOGIN CARD */}
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 shadow-2xl shadow-black/20">
            {/* ICON */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
              <LockKeyhole className="h-5 w-5 text-cyan-300" />
            </div>

            {/* TITLE */}
            <h1 className="mt-6 text-2xl font-bold">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to continue to your PrivyGuard account.
            </p>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-cyan-300 transition hover:text-cyan-200"
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-white/10 bg-black/20 accent-cyan-300"
                />

                <label
                  htmlFor="remember"
                  className="text-xs text-slate-500"
                >
                  Remember me
                </label>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-300 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 active:scale-[0.99]"
              >
                Sign In
              </button>
            </form>

            {/* REGISTER */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Create one
              </Link>
            </p>
          </div>

          {/* SECURITY NOTE */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            Your privacy matters to us.
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;