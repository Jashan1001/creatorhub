import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton, SkeletonAvatar } from "@/components/ui/Skeleton";
import type { Subscription } from "@/types";

function SubscriptionSkeleton() {
  return (
    <Card className="flex items-center gap-4">
      <SkeletonAvatar size={44} />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-8 w-20 rounded-md" />
    </Card>
  );
}

export default function FanDashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading]             = useState(true);
  const [cancelTarget, setCancelTarget]   = useState<Subscription | null>(null);
  const [canceling, setCanceling]         = useState(false);

  const load = async () => {
    try {
      const res = await api.get<Subscription[]>("/subscriptions/mine");
      setSubscriptions(res.data);
    } catch {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCanceling(true);
    try {
      await api.delete(`/subscriptions/${cancelTarget._id}/cancel`);
      toast.success("Subscription canceled — stays active until end of billing period");
      setCancelTarget(null);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to cancel");
    } finally {
      setCanceling(false);
    }
  };

  const fmtRs   = (paise: number) => `₹${(paise / 100).toLocaleString("en-IN")}`;
  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto py-12 px-4">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-(--text-primary)">My subscriptions</h1>
        <p className="text-sm text-(--text-secondary) mt-1">
          Creators you're supporting
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <>
            <SubscriptionSkeleton />
            <SubscriptionSkeleton />
          </>
        ) : subscriptions.length === 0 ? (
          <Card className="text-center py-16 flex flex-col items-center gap-3">
            <Crown size={32} className="text-(--text-muted)" />
            <p className="text-(--text-secondary) text-sm font-medium">No active subscriptions</p>
            <p className="text-xs text-(--text-muted)">
              Visit a creator's page and subscribe to support them
            </p>
          </Card>
        ) : (
          subscriptions.map((sub, i) => {
            const creator = sub.creatorId as any;
            const tier    = sub.tierId    as any;
            const isPastDue = sub.status === "past_due";

            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className={isPastDue ? "border-(--warning)/30" : ""}>
                  <div className="flex items-center gap-4">
                    {/* Creator avatar */}
                    <a
                      href={`/${creator?.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <div className="w-11 h-11 rounded-full bg-(--bg-elevated) border border-(--border) overflow-hidden">
                        {creator?.avatar
                          ? <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center font-semibold text-(--text-muted)">
                              {creator?.name?.[0]?.toUpperCase()}
                            </div>
                        }
                      </div>
                    </a>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={`/${creator?.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-(--text-primary) hover:text-accent transition-colors flex items-center gap-1 truncate"
                        >
                          {creator?.name}
                          <ExternalLink size={11} className="shrink-0 opacity-50" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Crown size={11} className="text-accent shrink-0" />
                        <span className="text-xs text-(--text-secondary)">{tier?.name}</span>
                        <span className="text-xs font-medium text-accent">{fmtRs(tier?.price ?? 0)}/mo</span>
                      </div>
                      {sub.currentPeriodEnd && (
                        <p className="text-xs text-(--text-muted) mt-0.5">
                          {sub.status === "canceled" ? "Ends" : "Renews"} {fmtDate(sub.currentPeriodEnd)}
                        </p>
                      )}
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={
                          sub.status === "active"   ? "success"  :
                          sub.status === "past_due" ? "warning"  :
                          sub.status === "canceled" ? "default"  : "default"
                        }
                        dot
                        pulse={isPastDue}
                      >
                        {sub.status === "past_due" ? "past due" : sub.status}
                      </Badge>

                      {sub.status === "active" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancelTarget(sub)}
                          className="text-(--text-muted) hover:text-(--danger) text-xs"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Past due warning */}
                  {isPastDue && (
                    <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-(--warning)/5 border border-(--warning)/20 rounded-md">
                      <AlertCircle size={13} className="text-(--warning) shrink-0" />
                      <p className="text-xs text-(--warning)">
                        Payment failed — update your payment method to continue access
                      </p>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Cancel confirmation modal */}
      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancel subscription?"
        description={`You'll lose access to ${(cancelTarget?.creatorId as any)?.name}'s exclusive content at the end of the current billing period.`}
        size="sm"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 bg-(--bg-elevated) rounded-lg">
            <CheckCircle2 size={15} className="text-(--success) shrink-0" />
            <p className="text-xs text-(--text-secondary)">
              Access continues until end of billing period
            </p>
          </div>
          <div className="flex gap-3 pt-1">
            <Button
              variant="danger"
              loading={canceling}
              onClick={handleCancel}
              className="flex-1"
            >
              Yes, cancel
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCancelTarget(null)}
              className="flex-1"
            >
              Keep subscription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}