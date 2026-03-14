import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, MousePointer, Users, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import type { AnalyticsSummary, EarningsSummary } from "@/types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  delay?: number;
}

const StatCard = ({ icon, label, value, sub, accent, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    <Card accent={accent} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-(--text-secondary)">{label}</span>
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent ? "bg-(--accent-muted)" : "bg-(--bg-elevated)"}`}>
          <span className={accent ? "text-accent" : "text-(--text-muted)"}>
            {icon}
          </span>
        </div>
      </div>
      <div>
        <p className="font-display text-2xl font-bold text-(--text-primary)">{value}</p>
        {sub && <p className="text-xs text-(--text-muted) mt-0.5">{sub}</p>}
      </div>
    </Card>
  </motion.div>
);

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
  const fmtRupees = (paise: number) => `INR ${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-(--text-primary)">
          Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
          {user?.name.split(" ")[0]}{' '}👋
        </h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          Here&apos;s what&apos;s happening on your page.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={<TrendingUp size={16} />}
          label="Page views"
          value={loading ? "-" : fmt(analytics?.totals.views ?? 0)}
          sub="All time"
          delay={0}
        />
        <StatCard
          icon={<MousePointer size={16} />}
          label="Link clicks"
          value={loading ? "-" : fmt(analytics?.totals.clicks ?? 0)}
          sub="All time"
          delay={0.05}
        />
        <StatCard
          icon={<Users size={16} />}
          label="Subscribers"
          value={loading ? "-" : fmt(earnings?.totalSubscribers ?? 0)}
          sub="Active"
          delay={0.1}
        />
        <StatCard
          icon={<DollarSign size={16} />}
          label="MRR"
          value={loading ? "-" : fmtRupees(earnings?.mrr ?? 0)}
          sub="Monthly recurring"
          accent
          delay={0.15}
        />
      </div>

      {/* Recent activity */}
      {analytics && analytics.daily.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-sm font-medium text-(--text-secondary) mb-4">
              Last 30 days
            </h3>
            <div className="flex items-end gap-1 h-24">
              {analytics.daily.slice(-30).map((d, i) => {
                const max = Math.max(...analytics.daily.map((x) => x.views), 1);
                const h = Math.max((d.views / max) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col gap-0.5 group relative">
                    <div
                      className="w-full bg-(--accent-muted) group-hover:bg-accent rounded-sm transition-all duration-(--transition) cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-(--bg-elevated) border border-(--border) rounded px-2 py-1 text-xs text-(--text-primary) whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {d.date}: {d.views} views
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Top links */}
      {analytics && analytics.topLinks.length > 0 && (
        <Card>
          <h3 className="text-sm font-medium text-(--text-secondary) mb-4">
            Top links
          </h3>
          <div className="flex flex-col gap-2">
            {analytics.topLinks.map((link, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-(--border-subtle) last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-(--text-muted) w-4 shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-(--text-primary) truncate">
                    {link.title || link.url || "Untitled link"}
                  </span>
                </div>
                <span className="text-sm font-medium text-accent shrink-0 ml-4">
                  {link.clicks} clicks
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

