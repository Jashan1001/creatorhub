import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, MousePointer, Users, IndianRupee,
  ExternalLink, Copy, Check, ArrowRight,
  Layers, BarChart2, DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import type { AnalyticsSummary, EarningsSummary } from "@/types";

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, accent = false, delay = 0, loading = false,
}: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; accent?: boolean; delay?: number; loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="bg-(--bg-surface) border border-(--border) rounded-lg p-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-20 skeleton rounded" />
          <div className="w-8 h-8 skeleton rounded-md" />
        </div>
        <div className="h-8 w-16 skeleton rounded" />
        <div className="h-3 w-12 skeleton rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card accent={accent} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-(--text-secondary)">{label}</span>
          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${accent ? "bg-(--accent-muted)" : "bg-(--bg-elevated)"}`}>
            <span className={accent ? "text-accent" : "text-(--text-muted)"}>{icon}</span>
          </div>
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-(--text-primary)">{value}</p>
          {sub && <p className="text-xs text-(--text-muted) mt-0.5">{sub}</p>}
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Quick action card ────────────────────────────────────────────────────────
function QuickAction({
  icon, label, desc, to, delay,
}: {
  icon: React.ReactNode; label: string; desc: string; to: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link to={to}>
        <Card hover className="flex items-center gap-4 p-4 group">
          <div className="w-9 h-9 rounded-lg bg-(--bg-elevated) flex items-center justify-center text-(--text-muted) group-hover:bg-(--accent-muted) group-hover:text-accent transition-all duration-(--transition) shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--text-primary)">{label}</p>
            <p className="text-xs text-(--text-muted) truncate">{desc}</p>
          </div>
          <ArrowRight size={14} className="text-(--text-muted) group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-(--transition) shrink-0" />
        </Card>
      </Link>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [earnings,  setEarnings]  = useState<EarningsSummary | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/summary"),
      api.get("/subscriptions/earnings"),
    ])
      .then(([a, e]) => {
        setAnalytics(a.data);
        setEarnings(e.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const fmt       = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const fmtRupees = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;

  const pageUrl = `${window.location.origin}/${user?.username}`;

  const copyUrl = async () => {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const maxViews = Math.max(...(analytics?.daily.map((d) => d.views) ?? [1]), 1);

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            {greeting()}, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-(--text-secondary) mt-1">
            Here's what's happening on your page.
          </p>
        </div>

        {/* Page URL pill */}
        <div className="flex items-center gap-2 px-3 py-2 bg-(--bg-elevated) border border-(--border) rounded-lg text-sm">
          <span className="text-(--text-muted) truncate max-w-48">
            creatorforge.io/@{user?.username}
          </span>
          <div className="flex items-center gap-1.5 ml-1 shrink-0">
            <button
              onClick={copyUrl}
              className="p-1 rounded text-(--text-muted) hover:text-(--text-primary) transition-colors"
              title="Copy URL"
            >
              {copied ? <Check size={13} className="text-(--success)" /> : <Copy size={13} />}
            </button>
            <a
              href={pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-(--text-muted) hover:text-(--text-primary) transition-colors"
              title="View page"
            >
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp size={16} />}    label="Page views"   value={loading ? "—" : fmt(analytics?.totals.views ?? 0)}          sub="All time"         delay={0}    loading={loading} />
        <StatCard icon={<MousePointer size={16} />}  label="Link clicks"  value={loading ? "—" : fmt(analytics?.totals.clicks ?? 0)}         sub="All time"         delay={0.05} loading={loading} />
        <StatCard icon={<Users size={16} />}         label="Subscribers"  value={loading ? "—" : fmt(earnings?.totalSubscribers ?? 0)}        sub="Active"           delay={0.1}  loading={loading} />
        <StatCard icon={<IndianRupee size={16} />}   label="MRR"          value={loading ? "—" : fmtRupees(earnings?.mrr ?? 0)}              sub="Monthly recurring" delay={0.15} loading={loading} accent />
      </div>

      {/* ── Activity chart ── */}
      {loading ? (
        <SkeletonCard />
      ) : analytics && analytics.daily.length > 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-(--text-primary)">Last 30 days</h3>
              <Link to="/dashboard/analytics" className="text-xs text-accent hover:underline flex items-center gap-1">
                Full analytics <ArrowRight size={11} />
              </Link>
            </div>
            <div className="flex items-end gap-0.5 h-24">
              {analytics.daily.slice(-30).map((d, i) => {
                const h = Math.max((d.views / maxViews) * 100, 2);
                return (
                  <div key={i} className="flex-1 group relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.4, delay: i * 0.01 }}
                      className="w-full bg-(--accent-muted) group-hover:bg-accent rounded-t-sm transition-colors cursor-pointer"
                    />
                    <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-(--bg-elevated) border border-(--border) rounded-md px-2 py-1 text-xs text-(--text-primary) whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      <span className="text-(--text-muted)">{d.date.slice(5)}</span>{" "}
                      <span className="text-accent font-medium">{d.views}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      ) : null}

      {/* ── Two-column: Top links + Quick actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top links */}
        {analytics && analytics.topLinks.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-(--text-primary)">Top links</h3>
                <Badge variant="default">{analytics.topLinks.length} links</Badge>
              </div>
              <div className="flex flex-col gap-1">
                {analytics.topLinks.map((link, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-(--border-subtle) last:border-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-xs text-(--text-muted) w-4 shrink-0 font-mono tabular-nums">{i + 1}</span>
                      <span className="text-sm text-(--text-secondary) truncate">
                        {link.title || link.url || "Untitled link"}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-accent shrink-0 ml-4 tabular-nums">
                      {link.clicks}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-(--text-muted) uppercase tracking-wider px-1">Quick actions</p>
            <QuickAction
              icon={<Layers size={16} />}
              label="Builder"
              desc="Add and reorder your blocks"
              to="/dashboard/builder"
              delay={0.32}
            />
            <QuickAction
              icon={<BarChart2 size={16} />}
              label="Analytics"
              desc="Views, clicks, device breakdown"
              to="/dashboard/analytics"
              delay={0.36}
            />
            <QuickAction
              icon={<DollarSign size={16} />}
              label="Monetize"
              desc="Manage tiers and subscribers"
              to="/dashboard/monetize"
              delay={0.4}
            />
          </div>
        </motion.div>
      </div>

    </div>
  );
}