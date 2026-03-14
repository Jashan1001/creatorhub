import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
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
      <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const maxViews = Math.max(...(data?.daily.map((d) => d.views) ?? [1]), 1);
  const maxClicks = Math.max(...(data?.daily.map((d) => d.clicks) ?? [1]), 1);
  const totalDevice = data?.devices.reduce((s, d) => s + d.count, 0) ?? 1;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-(--text-primary)">Analytics</h1>
        <p className="text-sm text-(--text-secondary) mt-1">Rolling 30-day window</p>
      </div>

      {/* Views + clicks chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-(--text-primary)">Views & clicks</h3>
          <div className="flex items-center gap-4 text-xs text-(--text-muted)">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-accent inline-block" /> Views
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-(--info) inline-block" /> Clicks
            </span>
          </div>
        </div>

        {data && data.daily.length > 0 ? (
          <div className="flex items-end gap-1 h-40">
            {data.daily.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col-reverse gap-0.5 group relative">
                <div
                  className="w-full bg-(--accent-muted) group-hover:bg-accent rounded-sm transition-all duration-(--transition)"
                  style={{ height: `${(d.views / maxViews) * 100}%` }}
                />
                <div
                  className="w-full bg-(--info)/20 group-hover:bg-(--info)/40 rounded-sm transition-all duration-(--transition)"
                  style={{ height: `${(d.clicks / maxClicks) * 40}%` }}
                />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-(--bg-elevated) border border-(--border) rounded-md px-2 py-1.5 text-xs text-(--text-primary) whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                  <div className="font-medium">{d.date}</div>
                  <div className="text-accent">{d.views} views</div>
                  <div className="text-(--info)">{d.clicks} clicks</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center text-(--text-muted) text-sm">
            No data yet - share your page to start tracking
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <Card>
          <h3 className="text-sm font-medium text-(--text-primary) mb-4">Devices</h3>
          <div className="flex flex-col gap-3">
            {data?.devices.length ? data.devices.map((d) => (
              <div key={d._id} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize text-(--text-secondary)">{d._id}</span>
                  <span className="text-(--text-muted)">
                    {((d.count / totalDevice) * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-(--bg-elevated) rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.count / totalDevice) * 100}%` }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-(--text-muted)">No data yet</p>
            )}
          </div>
        </Card>

        {/* Top links */}
        <Card>
          <h3 className="text-sm font-medium text-(--text-primary) mb-4">Top links</h3>
          <div className="flex flex-col gap-2">
            {data?.topLinks.length ? data.topLinks.map((l, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-(--border-subtle) last:border-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs text-(--text-muted) w-4 shrink-0">{i + 1}</span>
                  <span className="text-sm text-(--text-secondary) truncate">
                    {l.title || l.url || "Untitled"}
                  </span>
                </div>
                <span className="text-sm font-medium text-accent ml-4 shrink-0">
                  {l.clicks}
                </span>
              </div>
            )) : (
              <p className="text-sm text-(--text-muted)">No clicks yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

