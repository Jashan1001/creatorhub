import { useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Link2,
  Lock,
  BarChart2,
  DollarSign,
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";

const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center border-b border-(--border) bg-(--bg-base)/80 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
          <Zap size={13} className="text-(--text-inverse)" />
        </div>
        <span className="font-display font-bold text-(--text-primary) tracking-tight">
          CreatorForge
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors px-3 py-1.5"
        >
          Sign in
        </Link>
        <Link
          to="/signup"
          className="text-sm font-medium px-4 py-1.5 rounded-md bg-accent text-(--text-inverse) hover:bg-(--accent-hover) transition-colors"
        >
          Get started
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-28 px-6 text-center relative overflow-hidden">
    <div
      className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #f59e0b, transparent)" }}
    />

    <div className="max-w-4xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-(--accent-border) bg-(--accent-muted) text-xs font-medium text-accent mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        Now live - build your page in minutes
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-(--text-primary) leading-[1.05] tracking-tight mb-6"
      >
        Your audience.
        <br />
        <span className="text-accent">Your revenue.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-(--text-secondary) max-w-2xl mx-auto leading-relaxed mb-10"
      >
        Build a customizable creator page, set subscription tiers, gate premium
        content, and track your audience - all from one dashboard.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center justify-center gap-4 flex-wrap"
      >
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-(--text-inverse) font-semibold text-sm hover:bg-(--accent-hover) transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
        >
          Start for free
          <ArrowRight size={16} />
        </Link>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-(--border) text-(--text-secondary) text-sm hover:border-(--border-strong) hover:text-(--text-primary) transition-all"
        >
          Sign in
          <ChevronRight size={16} />
        </Link>
      </motion.div>
    </div>
  </section>
);

const PagePreview = () => (
  <FadeIn className="max-w-5xl mx-auto px-6 mb-28">
    <div className="rounded-2xl border border-(--border) overflow-hidden bg-(--bg-surface) shadow-(--shadow-lg)">
      <div className="h-10 flex items-center gap-2 px-4 border-b border-(--border) bg-(--bg-elevated)">
        <div className="flex items-center gap-1.5">
          {["#ef4444", "#f59e0b", "#10b981"].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 mx-4 h-5 rounded-md bg-(--bg-surface) flex items-center px-2">
          <span className="text-xs text-(--text-muted)">
            creatorforge.vercel.app/@jashan
          </span>
        </div>
      </div>

      <div className="p-8 flex gap-8">
        <div className="flex-1 flex flex-col items-center gap-3 py-6">
          <div className="w-16 h-16 rounded-full bg-(--bg-elevated) border-2 border-(--border) flex items-center justify-center font-display text-xl font-bold text-accent">
            J
          </div>
          <div className="text-center">
            <div className="font-display font-bold text-(--text-primary) text-sm">Jashan Singh</div>
            <div className="text-xs text-(--text-muted) mt-0.5">@jashan · Designer &amp; Creator</div>
          </div>

          <div className="w-full max-w-[260px] flex flex-col gap-2 mt-2">
            {[
              { label: "My Design Portfolio", locked: false },
              { label: "YouTube Channel", locked: false },
              { label: "Exclusive Tutorials", locked: true },
              { label: "Monthly Design Files", locked: true },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-xs border"
                style={{
                  background: item.locked ? "var(--accent-muted)" : "var(--bg-elevated)",
                  borderColor: item.locked ? "var(--accent-border)" : "var(--border)",
                  color: item.locked ? "var(--accent)" : "var(--text-primary)",
                }}
              >
                <span className="font-medium truncate">{item.label}</span>
                {item.locked && <Lock size={10} className="shrink-0 ml-2" />}
              </div>
            ))}
          </div>

          <button className="mt-2 w-full max-w-[260px] py-2 rounded-lg text-xs font-semibold text-(--text-inverse) bg-accent hover:bg-(--accent-hover) transition-colors">
            Subscribe - ₹499/mo
          </button>
        </div>

        <div className="w-64 shrink-0 flex flex-col gap-3">
          <div className="text-xs font-medium text-(--text-secondary) mb-1">Dashboard</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Views", value: "2.4k" },
              { label: "Clicks", value: "891" },
              { label: "Subs", value: "47" },
              { label: "MRR", value: "₹23k" },
            ].map((s) => (
              <div key={s.label} className="bg-(--bg-elevated) rounded-lg p-2.5 border border-(--border)">
                <div className="text-xs text-(--text-muted)">{s.label}</div>
                <div className="font-display font-bold text-sm text-(--text-primary) mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-(--bg-elevated) rounded-lg p-3 border border-(--border)">
            <div className="text-xs text-(--text-muted) mb-2">Last 7 days</div>
            <div className="flex items-end gap-1 h-12">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 bg-(--accent-muted) rounded-sm hover:bg-accent transition-colors" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </FadeIn>
);

const features = [
  {
    icon: Link2,
    title: "Page builder",
    desc: "Drag-and-drop blocks - links, text, images, videos. Reorder in seconds.",
  },
  {
    icon: Lock,
    title: "Content gating",
    desc: "Lock any block behind a subscription tier. Free visitors see a teaser, subscribers see everything.",
  },
  {
    icon: DollarSign,
    title: "Subscription tiers",
    desc: "Create multiple tiers with custom pricing and benefits. Powered by Razorpay.",
  },
  {
    icon: BarChart2,
    title: "Real analytics",
    desc: "Page views, link clicks, device breakdown, top links. 30-day rolling window.",
  },
];

const Features = () => (
  <section className="py-24 px-6 border-t border-(--border)">
    <div className="max-w-6xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-(--text-primary) mb-4">
          Everything you need to monetize
        </h2>
        <p className="text-(--text-secondary) max-w-xl mx-auto">
          Stop duct-taping five tools together. CreatorForge is the single platform
          for your page, your subscriptions, and your analytics.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <FadeIn key={title} delay={i * 0.08}>
            <div className="h-full bg-(--bg-surface) border border-(--border) rounded-xl p-6 flex flex-col gap-4 hover:border-(--border-strong) transition-all duration-(--transition) group">
              <div className="w-10 h-10 rounded-md bg-(--accent-muted) flex items-center justify-center group-hover:bg-accent transition-all duration-300">
                <Icon size={18} className="text-accent group-hover:text-(--text-inverse) transition-colors duration-300" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-(--text-primary) mb-1.5">{title}</h3>
                <p className="text-sm text-(--text-secondary) leading-relaxed">{desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    desc: "Get started, no credit card needed.",
    features: ["Unlimited free blocks", "Public creator page", "Basic analytics", "3 themes"],
    cta: "Start free",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "per month",
    desc: "For creators ready to earn.",
    features: [
      "Everything in Free",
      "Subscription tiers",
      "Content gating",
      "Full analytics",
      "Custom avatar + bio",
      "Priority support",
    ],
    cta: "Get Pro",
    highlight: true,
  },
];

const Pricing = () => (
  <section className="py-24 px-6 border-t border-(--border)">
    <div className="max-w-4xl mx-auto">
      <FadeIn className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-(--text-primary) mb-4">Simple pricing</h2>
        <p className="text-(--text-secondary)">Start free. Upgrade when you&apos;re ready to earn.</p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {plans.map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 0.1}>
            <div
              className={`h-full rounded-xl p-6 flex flex-col gap-5 border transition-all ${
                plan.highlight
                  ? "border-(--accent-border) bg-(--accent-muted) shadow-(--shadow-accent)"
                  : "border-(--border) bg-(--bg-surface)"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-(--text-secondary)">{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent text-(--text-inverse)">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-bold text-(--text-primary)">{plan.price}</span>
                  <span className="text-sm text-(--text-muted)">/{plan.period}</span>
                </div>
                <p className="text-sm text-(--text-secondary) mt-1">{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-(--text-secondary)">
                    <Check size={14} className="text-(--success) shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`w-full py-2.5 rounded-md text-sm font-semibold text-center transition-all ${
                  plan.highlight
                    ? "bg-accent text-(--text-inverse) hover:bg-(--accent-hover)"
                    : "bg-(--bg-elevated) text-(--text-primary) hover:bg-(--bg-hover)"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const CTABanner = () => (
  <FadeIn>
    <section className="py-24 px-6 border-t border-(--border)">
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-32 rounded-full opacity-[0.07] blur-3xl" style={{ background: "radial-gradient(ellipse, #f59e0b, transparent)" }} />
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold text-(--text-primary) mb-4 relative">
            Your page is one
            <br />
            <span className="text-accent">click away.</span>
          </h2>
          <p className="text-(--text-secondary) mb-8 relative">
            Join creators who are building their audience and earning on their own terms.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-(--text-inverse) font-semibold text-base hover:bg-(--accent-hover) shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 relative"
          >
            Create your page free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  </FadeIn>
);

const Footer = () => (
  <footer className="border-t border-(--border) py-8 px-6">
    <div className="max-w-6xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-accent flex items-center justify-center">
          <Zap size={11} className="text-(--text-inverse)" />
        </div>
        <span className="text-sm font-display font-bold text-(--text-primary)">CreatorForge</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-(--text-muted)">
        <Link to="/login" className="hover:text-(--text-secondary) transition-colors">Sign in</Link>
        <Link to="/signup" className="hover:text-(--text-secondary) transition-colors">Sign up</Link>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-(--bg-base) min-h-screen">
      <Navbar />
      <Hero />
      <PagePreview />
      <Features />
      <Pricing />
      <CTABanner />
      <Footer />
    </div>
  );
}


