import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [searchParams]  = useSearchParams();
  const navigate        = useNavigate();
  const token           = searchParams.get("token") ?? "";

  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [done,       setDone]       = useState(false);
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    if (!token) setTokenError(true);
  }, [token]);

  const passwordsMatch = password === confirm;
  const isLongEnough   = password.length >= 8;
  const canSubmit      = passwordsMatch && isLongEnough && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password });
      setDone(true);
      toast.success("Password updated!");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Reset failed";
      if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("expired")) {
        setTokenError(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-96 flex flex-col items-center text-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-(--danger)/10 border border-(--danger)/20 flex items-center justify-center">
            <AlertCircle size={24} className="text-(--danger)" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-(--text-primary) mb-2">
              Link expired or invalid
            </h2>
            <p className="text-sm text-(--text-secondary)">
              This reset link has expired or already been used. Reset links are only valid for 1 hour.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="px-5 py-2.5 rounded-md bg-accent text-(--text-inverse) text-sm font-semibold hover:bg-(--accent-hover) transition-colors"
          >
            Request new link
          </Link>
        </motion.div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-96 flex flex-col items-center text-center gap-5"
        >
          <div className="w-14 h-14 rounded-full bg-(--success)/10 border border-(--success)/20 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-(--success)" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-(--text-primary) mb-2">
              Password updated
            </h2>
            <p className="text-sm text-(--text-secondary)">
              Redirecting you to sign in…
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-96"
      >
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <Zap size={16} className="text-(--text-inverse)" />
          </div>
          <span className="font-display font-bold text-lg text-(--text-primary)">CreatorForge</span>
        </div>

        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold text-(--text-primary) mb-1">
            Set new password
          </h2>
          <p className="text-sm text-(--text-secondary)">
            Must be at least 8 characters.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {(["password", "confirm"] as const).map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-(--text-secondary)">
                {field === "password" ? "New password" : "Confirm password"}
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={field === "password" ? password : confirm}
                  onChange={(e) =>
                    field === "password"
                      ? setPassword(e.target.value)
                      : setConfirm(e.target.value)
                  }
                  className="w-full px-3 py-2.5 pr-10 text-sm bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-md placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all"
                  required
                />
                {field === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary)"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
              {field === "password" && password && !isLongEnough && (
                <p className="text-xs text-(--danger)">Must be at least 8 characters</p>
              )}
              {field === "confirm" && confirm && !passwordsMatch && (
                <p className="text-xs text-(--danger)">Passwords don't match</p>
              )}
              {field === "confirm" && confirm && passwordsMatch && isLongEnough && (
                <p className="text-xs text-(--success) flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  Passwords match
                </p>
              )}
            </div>
          ))}

          <Button
            type="submit"
            loading={loading}
            disabled={!canSubmit}
            size="lg"
            className="w-full mt-2"
          >
            Update password
          </Button>
        </form>
      </motion.div>
    </div>
  );
}