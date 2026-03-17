import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconContainer } from "@/components/ui/IconContainer";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] font-body">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--bg-surface)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--border)] w-full max-w-sm flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <div className="mx-auto w-12 h-12 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-4">
            <LogIn size={24} className="text-[var(--text-secondary)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Log in to your CreatorHub account
          </p>
        </div>

        {error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-md px-3 py-2 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => f("email", e.target.value)}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => f("password", e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-inverse)] py-2.5 rounded-lg font-semibold transition-colors mt-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm text-center text-[var(--text-muted)] mt-2">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[var(--text-primary)] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
