import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Login failed";
      if (msg.toLowerCase().includes("credential")) {
        setErrors({ password: "Invalid email or password" });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-base) flex">
      <div className="hidden lg:flex w-120 shrink-0 flex-col justify-between bg-(--bg-surface) border-r border-(--border) p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <Zap size={16} className="text-(--text-inverse)" />
          </div>
          <span className="font-display font-bold text-lg text-(--text-primary)">CreatorForge</span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold text-(--text-primary) leading-tight mb-4">
            Your audience.<br />Your terms.<br />
            <span className="text-accent">Your revenue.</span>
          </h1>
          <p className="text-(--text-secondary) text-lg">
            Build a monetized creator page in minutes. Gate content, set tiers, track analytics.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {["Razorpay-grade payment flow", "Content gating by tier", "Real-time analytics"].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              <span className="text-sm text-(--text-secondary)">{f}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-100"
        >
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-(--text-primary) mb-1">Sign in</h2>
            <p className="text-sm text-(--text-secondary)">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-accent hover:underline">Sign up free</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Email or username"
              type="text"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              required
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--text-secondary)">Password</label>
                <Link to="/forgot-password" className="text-xs text-(--text-muted) hover:text-accent transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all duration-(--transition)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary) transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-(--danger)">{errors.password}</p>}
            </div>

            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
              Sign in
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}