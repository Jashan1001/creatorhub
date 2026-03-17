import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Check, Users, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const fmtRs = (paise: number) => `₹ ${(paise / 100).toLocaleString("en-IN")}`;

  return (
    <div className="flex flex-col gap-8 text-[var(--text-primary)]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">Monetize</h1>
          <p className="text-sm font-semibold text-[var(--text-secondary)] mt-1">
            Create subscription tiers for your audience
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-[var(--shadow-sm)] ${
            showForm ? "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]" : "bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
          }`}
        >
          <Plus size={16} />
          New tier
        </button>
      </div>

      {/* Earnings summary */}
      {earnings && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-muted)] flex items-center justify-center">
              <Users size={20} className="text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Active subscribers</p>
              <p className="font-display text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                {earnings.totalSubscribers}
              </p>
            </div>
          </div>
          <div className="bg-[var(--accent)] p-6 rounded-xl border border-[var(--accent-border)] shadow-[var(--shadow-accent)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[var(--text-inverse)]/10 flex items-center justify-center">
              <IndianRupee size={20} className="text-[var(--text-inverse)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-inverse)]/80">Monthly recurring</p>
              <p className="font-display text-2xl font-bold text-[var(--text-inverse)] tracking-tight">
                {fmtRs(earnings.mrr)}
              </p>
            </div>
          </div>
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
             className="overflow-hidden"
          >
            <div className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] mb-4">
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)] mb-5">
                Create tier
              </h3>
              <form onSubmit={handleCreate} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <Input label="Tier name" placeholder="VIP Members"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required />
                  <Input label="Price (INR/month)" type="number" placeholder="499"
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    hint="Minimum ₹ 1" required />
                </div>
                <Input label="Description" placeholder="Access to exclusive behind-the-scenes content..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />

                {/* Benefits */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-bold text-[var(--text-secondary)]">
                    Benefits
                  </label>
                  {form.benefits.map((b, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={b}
                        onChange={(e) => updateBenefit(i, e.target.value)}
                        placeholder={`Benefit ${i + 1}`}
                        className="flex-1 px-3 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)] rounded-lg placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all font-medium"
                      />
                      {form.benefits.length > 1 && (
                        <button type="button" onClick={() => removeBenefit(i)}
                          className="text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors px-2">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={addBenefit}
                    className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] self-start mt-1">
                    + Add benefit
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-[var(--border)] mt-2">
                   <button
                    type="submit"
                    disabled={saving}
                    className="bg-[var(--accent)] text-[var(--text-inverse)] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[var(--accent-hover)] transition shadow-[var(--shadow-sm)] disabled:opacity-50"
                  >
                    {saving ? "Creating..." : "Create tier"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-[var(--bg-elevated)] text-[var(--text-primary)] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[var(--bg-hover)] transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tiers list */}
      {loading ? (
        <div className="flex justify-center py-12">
           <span className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tiers.length === 0 ? (
        <div className="bg-[var(--bg-base)] border border-dashed border-[var(--border-strong)] rounded-xl text-center py-16">
          <div className="w-12 h-12 bg-[var(--bg-surface)] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[var(--shadow-sm)] border border-[var(--border)]">
            <IndianRupee size={20} className="text-[var(--text-muted)]" />
          </div>
          <p className="text-[var(--text-primary)] font-bold text-base">No tiers found</p>
          <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">
            Create your first subscription tier to start monetizing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <motion.div key={tier._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[var(--bg-surface)] p-6 rounded-xl border border-[var(--border)] shadow-[var(--shadow-sm)] flex flex-col h-full hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all cursor-default"
            >
              <div className="flex items-start justify-between mb-2">
                 <h3 className="font-display text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  {tier.name}
                </h3>
              </div>
              {tier.description && (
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-2 line-clamp-2">
                  {tier.description}
                </p>
              )}
              
              <div className="my-4 pb-4 border-b border-[var(--border-subtle)]">
                <span className="font-display text-3xl font-bold text-[var(--text-primary)]">{fmtRs(tier.price)}</span>
                <span className="text-sm font-semibold text-[var(--text-muted)] ml-1">/mo</span>
              </div>

              {tier.benefits.length > 0 && (
                <ul className="flex flex-col gap-2.5 mb-6">
                  {tier.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--text-primary)]">
                      <Check size={16} className="text-[var(--success)] shrink-0 mt-0.5 font-bold" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[var(--border-subtle)]">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${tier.active ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--danger)]/10 text-[var(--danger)]'}`}>
                  {tier.active ? "Active" : "Inactive"}
                </span>
                <button onClick={() => handleDelete(tier._id)}
                  className="ml-auto text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors p-1" title="Delete tier">
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
