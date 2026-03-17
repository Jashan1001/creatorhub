import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, MousePointer, Users, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import type { AnalyticsSummary, EarningsSummary } from "@/types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  delay?: number;
}

const StatCard = ({ icon, label, value, sub, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)] font-semibold">{label}</span>
        <div className="text-[var(--accent)] bg-[var(--accent-muted)] p-2 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="font-display text-3xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
        {sub && <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/summary"),
      api.get("/subscriptions/earnings"),
    ])
      .then(([a, e]) => {
        setAnalytics(a.data);
        setEarnings(e.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <div className="flex flex-col gap-8 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Welcome back, {user?.name.split(" ")[0]} 👋
          </h1>
          {user?.username && (
            <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              Your page:{" "}
              <a
                href={`/${user.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--accent)] hover:text-[var(--accent-hover)] hover:underline font-bold inline-flex items-center gap-1"
              >
                creatorhub.co/{user.username}
                <ExternalLink size={12} />
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Page Views"
          value={loading ? "-" : fmt(analytics?.totals.views ?? 0)}
          sub="All time"
        />
        <StatCard
          icon={<MousePointer size={18} />}
          label="Link Clicks"
          value={loading ? "-" : fmt(analytics?.totals.clicks ?? 0)}
          sub="All time"
          delay={0.05}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Subscribers"
          value={loading ? "-" : fmt(earnings?.totalSubscribers ?? 0)}
          sub="Active tier"
          delay={0.1}
        />
        <Link
          to="/dashboard/builder"
          className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all group flex flex-col justify-center gap-2"
        >
          <p className="text-sm text-[var(--text-secondary)] font-semibold">Blocks</p>
          <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
            Open Builder →
          </h2>
          <p className="text-xs font-semibold text-[var(--text-muted)]">Add & manage elements</p>
        </Link>
      </div>
    </div>
  );
}
