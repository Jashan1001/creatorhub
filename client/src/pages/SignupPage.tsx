import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", username: "", email: "", password: "", confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(form.username)) {
      e.username = "3-30 characters, letters/numbers/underscores only";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Signup failed";
      if (msg.toLowerCase().includes("email")) setErrors({ email: msg });
      else if (msg.toLowerCase().includes("username")) setErrors({ username: msg });
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const f = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-110"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <Zap size={16} className="text-(--text-inverse)" />
          </div>
          <span className="font-display font-bold text-lg text-(--text-primary)">
            CreatorForge
          </span>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-(--text-primary) mb-1">
            Create your account
          </h2>
          <p className="text-sm text-(--text-secondary)">
            Already have one?{" "}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Full name" placeholder="Jashan Singh"
            value={form.name} onChange={(e) => f("name", e.target.value)}
            error={errors.name} required />

          <Input label="Username" placeholder="jashan"
            value={form.username} onChange={(e) => f("username", e.target.value.toLowerCase())}
            error={errors.username}
            hint="This will be your public URL: creatorforge.vercel.app/@jashan"
            required />

          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={(e) => f("email", e.target.value)}
            error={errors.email} required />

          {/* Password with toggle */}
          {(["password", "confirm"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--text-secondary)">
                {field === "password" ? "Password" : "Confirm password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form[field]}
                  onChange={(e) => f(field, e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-(--bg-elevated) text-(--text-primary) border rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all duration-(--transition) border-(--border)"
                  required
                />
                {field === "password" && (
                  <button type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary)">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {errors[field] && (
                <p className="text-xs text-(--danger)">{errors[field]}</p>
              )}
            </div>
          ))}

          <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
            Create account
          </Button>
        </form>
      </motion.div>
    </div>
  );
}


