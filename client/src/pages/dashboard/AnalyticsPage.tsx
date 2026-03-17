import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import type { AnalyticsSummary } from "@/types";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/summary")
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <span className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const maxViews = Math.max(...(data?.daily.map((d) => d.views) ?? [1]), 1);
  const maxClicks = Math.max(...(data?.daily.map((d) => d.clicks) ?? [1]), 1);
  const totalDevice = Math.max(data?.devices.reduce((s, d) => s + d.count, 0) ?? 1, 1);

  return (
    <div className="flex flex-col gap-8 text-[var(--text-primary)]">
      <div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">Analytics</h1>
        <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">Rolling 30-day window</p>
      </div>

      {/* Views + clicks chart */}
      <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)]">Views & clicks</h3>
          <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)] inline-block" /> Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#d4a373] inline-block" /> Clicks
            </span>
          </div>
        </div>

        {data && data.daily.length > 0 ? (
          <div className="flex items-end gap-1 h-48">
            {data.daily.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col-reverse gap-0.5 group relative">
                <div
                  className="w-full bg-[var(--accent-muted)] group-hover:bg-[var(--accent)] rounded-sm transition-colors duration-150"
                  style={{ height: `${(d.views / maxViews) * 100}%` }}
                />
                <div
                  className="w-full bg-[var(--bg-elevated)] group-hover:bg-[#d4a373] rounded-sm transition-colors duration-150"
                  style={{ height: `${(d.clicks / maxClicks) * 40}%` }}
                />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[var(--text-primary)] text-[var(--text-inverse)] border border-[var(--border-strong)] rounded-md px-2.5 py-1.5 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center font-bold shadow-[var(--shadow-lg)]">
                  <div>{d.date}</div>
                  <div className="text-[var(--accent-border)] mt-0.5">{d.views} views</div>
                  <div className="text-[#d8b08c]">{d.clicks} clicks</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm font-semibold">
            No data yet - share your page to start tracking
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Devices</h3>
          <div className="flex flex-col gap-4">
            {data?.devices.length ? data.devices.map((d) => (
              <div key={d._id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="capitalize text-[var(--text-primary)]">{d._id}</span>
                  <span className="text-[var(--text-secondary)]">
                    {((d.count / totalDevice) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-base)] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / totalDevice) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-full bg-[var(--accent)] rounded-full"
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-[var(--text-muted)] font-semibold">No data yet</p>
            )}
          </div>
        </div>

        {/* Top links */}
        <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4">Top links</h3>
          <div className="flex flex-col gap-2">
            {data?.topLinks.length ? data.topLinks.map((l, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)] last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-[var(--text-muted)] w-4 shrink-0">{i + 1}</span>
                  <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                    {l.title || l.url || "Untitled"}
                  </span>
                </div>
                <span className="text-sm font-bold text-[var(--text-inverse)] ml-4 shrink-0 bg-[var(--accent)] px-2 py-0.5 rounded-md shadow-[var(--shadow-sm)]">
                  {l.clicks}
                </span>
              </div>
            )) : (
              <p className="text-sm text-[var(--text-muted)] font-semibold">No clicks yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
