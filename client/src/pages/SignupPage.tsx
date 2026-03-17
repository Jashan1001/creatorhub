import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form.name, form.username, form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] font-body py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--bg-surface)] p-8 rounded-xl shadow-[var(--shadow-md)] border border-[var(--border)] w-full max-w-sm flex flex-col gap-5"
      >
        <div className="text-center mb-2">
          <div className="mx-auto w-12 h-12 bg-[var(--bg-elevated)] rounded-full flex items-center justify-center mb-4">
            <UserPlus size={24} className="text-[var(--text-secondary)]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Create Account
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Start building your CreatorHub today
          </p>
        </div>

        {error && (
          <p className="text-sm text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-md px-3 py-2 text-center">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            name="name"
            placeholder="Jashan"
            value={form.name}
            onChange={(e) => f("name", e.target.value)}
            required
          />

          <Input
            label="Username"
            name="username"
            placeholder="jashan"
            value={form.username}
            onChange={(e) => f("username", e.target.value)}
            required
            hint="creatorhub.co/jashan"
          />

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
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-[var(--text-muted)] mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-[var(--text-primary)] font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
