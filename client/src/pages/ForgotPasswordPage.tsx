import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, ArrowLeft, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
    } catch {
      setSent(true);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-base) flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-96"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <Zap size={16} className="text-(--text-inverse)" />
          </div>
          <span className="font-display font-bold text-lg text-(--text-primary)">CreatorForge</span>
        </div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-(--accent-muted) border border-(--accent-border) flex items-center justify-center">
              <Mail size={24} className="text-accent" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-(--text-primary) mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-(--text-secondary) leading-relaxed">
                If <span className="text-(--text-primary)">{email}</span> is registered, we've sent
                a reset link. It expires in 1 hour.
              </p>
            </div>
            <p className="text-xs text-(--text-muted)">
              Didn't get it? Check spam, or{" "}
              <button
                onClick={() => setSent(false)}
                className="text-accent hover:underline"
              >
                try again
              </button>
            </p>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-(--text-primary) mb-1">
                Forgot password?
              </h2>
              <p className="text-sm text-(--text-secondary)">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
                Send reset link
              </Button>
            </form>

            <Link
              to="/login"
              className="mt-6 flex items-center gap-1.5 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </Link>
          </>
        )}
      </motion.div>
    </div>
  );
}