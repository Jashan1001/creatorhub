import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Users, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import type { SubscriptionTier, EarningsSummary } from "@/types";

export default function MonetizePage() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", benefits: [""],
  });

  const load = async () => {
    try {
      const [t, e] = await Promise.all([
        api.get("/tiers/mine"),
        api.get("/subscriptions/earnings"),
      ]);
      setTiers(t.data);
      setEarnings(e.data);
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addBenefit = () => setForm({ ...form, benefits: [...form.benefits, ""] });
  const updateBenefit = (i: number, val: string) => {
    const b = [...form.benefits];
    b[i] = val;
    setForm({ ...form, benefits: b });
  };
  const removeBenefit = (i: number) => setForm({
    ...form, benefits: form.benefits.filter((_, idx) => idx !== i),
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceRs = parseFloat(form.price);
    if (isNaN(priceRs) || priceRs < 1) {
      toast.error("Enter a valid price (min INR 1)");
      return;
    }
    setSaving(true);
    try {
      await api.post("/tiers", {
        name: form.name,
        description: form.description,
        price: Math.round(priceRs * 100),
        benefits: form.benefits.filter(Boolean),
      });
      toast.success("Tier created!");
      setForm({ name: "", description: "", price: "", benefits: [""] });
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? "Failed to create tier");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tier?")) return;
    try {
      await api.delete(`/tiers/${id}`);
      toast.success("Tier deleted");
      setTiers(tiers.filter((t) => t._id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const fmtRs = (paise: number) => `INR ${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">Monetize</h1>
          <p className="text-sm text-(--text-secondary) mt-1">
            Create subscription tiers for your audience
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"}>
          <Plus size={16} />
          New tier
        </Button>
      </div>

      {/* Earnings summary */}
      {earnings && (
        <div className="grid grid-cols-2 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-(--accent-muted) flex items-center justify-center">
              <Users size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-(--text-muted)">Active subscribers</p>
              <p className="font-display text-xl font-bold text-(--text-primary)">
                {earnings.totalSubscribers}
              </p>
            </div>
          </Card>
          <Card accent className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-(--accent-muted) flex items-center justify-center">
              <IndianRupee size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-(--text-muted)">Monthly recurring</p>
              <p className="font-display text-xl font-bold text-(--text-primary)">
                {fmtRs(earnings.mrr)}
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="border-(--accent-border)">
              <h3 className="text-sm font-semibold text-(--text-primary) mb-4">
                Create tier
              </h3>
              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Tier name" placeholder="Fan Club"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required />
                  <Input label="Price (INR/month)" type="number" placeholder="499"
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    hint="Minimum INR 1" required />
                </div>
                <Input label="Description" placeholder="Access to exclusive content..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />

                {/* Benefits */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-(--text-secondary)">
                    Benefits
                  </label>
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(e) => updateBenefit(i, e.target.value)}
                        placeholder={`Benefit ${i + 1}`}
                        className="flex-1 px-3 py-2 text-sm bg-(--bg-elevated) text-(--text-primary) border border-(--border) rounded-(--radius-md) placeholder:text-(--text-muted) focus:outline-none focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/20 transition-all duration-(--transition)"
                      />
                      {form.benefits.length > 1 && (
                        <button type="button" onClick={() => removeBenefit(i)}
                          className="text-(--text-muted) hover:text-(--danger) transition-colors p-2">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addBenefit}
                    className="text-xs text-accent hover:underline self-start">
                    + Add benefit
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" loading={saving}>Create tier</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiers list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <span className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tiers.length === 0 ? (
        <Card className="text-center py-16">
          <IndianRupee size={32} className="text-(--text-muted) mx-auto mb-3" />
          <p className="text-(--text-secondary) text-sm">No tiers yet</p>
          <p className="text-(--text-muted) text-xs mt-1">
            Create your first tier to start earning
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tiers.map((tier, i) => (
            <motion.div key={tier._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <Card hover className="flex flex-col gap-4 h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-(--text-primary)">
                      {tier.name}
                    </h3>
                    {tier.description && (
                      <p className="text-xs text-(--text-muted) mt-0.5 line-clamp-2">
                        {tier.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="accent">
                    {fmtRs(tier.price)}/mo
                  </Badge>
                </div>

                {tier.benefits.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {tier.benefits.map((b, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-(--text-secondary)">
                        <Check size={12} className="text-(--success) shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-2 mt-auto pt-2 border-t border-(--border-subtle)">
                  <Badge variant={tier.active ? "success" : "default"}>
                    {tier.active ? "Active" : "Inactive"}
                  </Badge>
                  <button onClick={() => handleDelete(tier._id)}
                    className="ml-auto text-(--text-muted) hover:text-(--danger) transition-colors p-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

