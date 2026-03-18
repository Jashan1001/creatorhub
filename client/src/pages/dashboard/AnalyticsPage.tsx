import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, MousePointer, Monitor, Smartphone, Tablet,
  Globe, ExternalLink, RefreshCw,
} from "lucide-react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import type { AnalyticsSummary } from "@/types";

interface Referrer { _id: string; count: number; }
interface ExtendedSummary extends AnalyticsSummary {
  referrers: Referrer[];
}

function StatCard({
  icon, label, value, sub, accent = false, delay = 0,
}: {
  icon: React.ReactNode; label: string; value: string; sub?: string;
  accent?: boolean; delay?: number;
}) {
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

function BarChart({ data }: { data: ExtendedSummary["daily"] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const maxViews  = Math.max(...data.map((d) => d.views), 1);
  const maxClicks = Math.max(...data.map((d) => d.clicks), 1);

  if (!data.length) {
    return (
      <div className="h-40 flex items-center justify-center text-(--text-muted) text-sm">
        No data yet — share your page to start tracking
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 text-xs text-(--text-muted) mb-4">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" /> Views
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-(--info) inline-block" /> Clicks
        </span>
      </div>

      <div className="flex items-end gap-0.5 h-40">
        {data.map((d, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col-reverse gap-0.5 cursor-pointer"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((d.views / maxViews) * 100, 2)}%` }}
              transition={{ duration: 0.5, delay: i * 0.01 }}
              className={`w-full rounded-t-sm transition-colors ${hovered === i ? "bg-accent" : "bg-(--accent-muted)"}`}
            />
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max((d.clicks / maxClicks) * 40, d.clicks > 0 ? 2 : 0)}%` }}
              transition={{ duration: 0.5, delay: i * 0.01 }}
              className={`w-full rounded-t-sm transition-colors ${hovered === i ? "bg-(--info)" : "bg-(--info)/30"}`}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center mt-2 text-xs text-(--text-muted)">
        {data.map((d, i) => {
          const show = i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1;
          return (
            <div key={i} className="flex-1 text-center">
              {show ? d.date.slice(5) : ""}
            </div>
          );
        })}
      </div>

      {hovered !== null && data[hovered] && (
        <div
          className="absolute bottom-full mb-2 bg-(--bg-elevated) border border-(--border) rounded-lg px-3 py-2 text-xs pointer-events-none z-10 shadow-(--shadow-md)"
          style={{ left: `${(hovered / data.length) * 100}%`, transform: "translateX(-50%)" }}
        >
          <p className="font-medium text-(--text-primary) mb-1">{data[hovered].date}</p>
          <p className="text-accent">{data[hovered].views} views</p>
          <p style={{ color: "var(--info)" }}>{data[hovered].clicks} clicks</p>
        </div>
      )}
    </div>
  );
}

function DeviceIcon({ device }: { device: string }) {
  if (device === "mobile")  return <Smartphone size={14} className="text-(--text-muted)" />;
  if (device === "tablet")  return <Tablet size={14} className="text-(--text-muted)" />;
  if (device === "desktop") return <Monitor size={14} className="text-(--text-muted)" />;
  return <Globe size={14} className="text-(--text-muted)" />;
}

export default function AnalyticsPage() {
  const [data, setData]           = useState<ExtendedSummary | null>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);
    try {
      const res = await api.get<ExtendedSummary>("/analytics/summary");
      setData(res.data);
    } catch {
      // silently fail — keeps showing stale data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const totalDevices = data?.devices.reduce((s, d) => s + d.count, 0) ?? 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">Analytics</h1>
          <p className="text-sm text-(--text-secondary) mt-1">Rolling 30-day window</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors px-3 py-1.5 rounded-md hover:bg-(--bg-elevated)"
        >
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={<TrendingUp size={16} />} label="Total views"
          value={fmt(data?.totals.views ?? 0)} sub="All time" delay={0} />
        <StatCard icon={<MousePointer size={16} />} label="Total clicks"
          value={fmt(data?.totals.clicks ?? 0)} sub="All time" accent delay={0.05} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card>
          <h3 className="text-sm font-medium text-(--text-primary) mb-2">Views & clicks — last 30 days</h3>
          <BarChart data={data?.daily ?? []} />
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <h3 className="text-sm font-medium text-(--text-primary) mb-4">Devices</h3>
            {data?.devices.length ? (
              <div className="flex flex-col gap-3">
                {data.devices.map((d, i) => {
                  const pct = (d.count / totalDevices) * 100;
                  return (
                    <div key={i} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 capitalize text-(--text-secondary)">
                          <DeviceIcon device={d._id} />{d._id}
                        </span>
                        <span className="text-(--text-muted) text-xs">{d.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-(--bg-elevated) rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.2 + i * 0.05 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-(--text-muted)">No data yet</p>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <h3 className="text-sm font-medium text-(--text-primary) mb-4">Top links</h3>
            {data?.topLinks.length ? (
              <div className="flex flex-col gap-1">
                {data.topLinks.map((l, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-(--border-subtle) last:border-0 group">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-(--text-muted) w-4 shrink-0 font-mono">{i + 1}</span>
                      <span className="text-sm text-(--text-secondary) truncate">
                        {l.title || l.url || "Untitled link"}
                      </span>
                      {l.url && (
                        <a href={l.url as string} target="_blank" rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <ExternalLink size={11} className="text-(--text-muted)" />
                        </a>
                      )}
                    </div>
                    <span className="text-sm font-medium text-accent ml-4 shrink-0">{l.clicks} clicks</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-(--text-muted)">No clicks yet</p>
            )}
          </Card>
        </motion.div>
      </div>

      {(data?.referrers?.length ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <h3 className="text-sm font-medium text-(--text-primary) mb-4">Top referrers</h3>
            <div className="flex flex-col gap-2">
              {data!.referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-(--border-subtle) last:border-0">
                  <div className="flex items-center gap-2">
                    <Globe size={13} className="text-(--text-muted) shrink-0" />
                    <span className="text-sm text-(--text-secondary)">{r._id || "direct"}</span>
                  </div>
                  <span className="text-sm text-(--text-muted)">{r.count} visits</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}