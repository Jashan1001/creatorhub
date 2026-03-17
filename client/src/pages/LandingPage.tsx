import { useRef } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Zap,
  Layout,
  BarChart2,
  DollarSign,
  ArrowRight,
  Check,
  Smartphone,
  Globe,
  Share2,
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
  <nav className="fixed top-0 inset-x-0 z-50 h-16 flex items-center border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md">
    <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-[var(--shadow-sm)]">
          <Zap size={16} className="text-[var(--text-inverse)]" />
        </div>
        <span className="font-display font-bold text-[var(--text-primary)] tracking-tight text-lg">
          CreatorHub
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          Log in
        </Link>
        <Link
          to="/signup"
          className="text-sm font-medium px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-sm)]"
        >
          Sign up free
        </Link>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="pt-40 pb-24 px-6 md:px-12 text-center relative overflow-hidden bg-[var(--bg-base)]">
    <div
      className="absolute top-20 left-1/2 -translate-x-1/2 w-[650px] h-[320px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
      style={{ background: "radial-gradient(ellipse, #A05C3E, transparent)" }}
    />

    <div className="max-w-4xl mx-auto relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent-border)] bg-[var(--accent-muted)] shadow-[var(--shadow-sm)] text-xs font-semibold text-[var(--accent)] mb-8"
      >
        <span className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
        Version 2.0 is now live
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display text-5xl md:text-6xl lg:text-[72px] font-extrabold text-[var(--text-primary)] leading-[1.1] tracking-tight mb-6"
      >
        Your Entire Creator World
        <br />
        <span className="block mt-2 text-[var(--accent)]">In One Link.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
      >
        A single, beautiful profile to house everything you create, sell, and share. Claim your unique link and start building your audience.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link
          to="/signup"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--accent)] text-[var(--text-inverse)] font-semibold text-base hover:bg-[var(--accent-hover)] transition-all shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-accent)]"
        >
          Claim your link
          <ArrowRight size={18} />
        </Link>
        <div className="text-sm font-medium text-[var(--text-muted)]">
          creatorhub.co/<span className="text-[var(--text-primary)]">yourname</span>
        </div>
      </motion.div>
    </div>
  </section>
);

const Problem = () => (
  <section className="py-24 px-6 md:px-12 bg-[var(--bg-surface)] border-y border-[var(--border)]">
    <div className="max-w-6xl mx-auto">
      <FadeIn className="text-center mb-16">
         <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
          Creators Are Everywhere.
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
          You have YouTube videos, tweets, Instagram posts, a newsletter, and courses. Directing your audience to just one place is impossible without a central hub.
        </p>
      </FadeIn>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
           { icon: Globe, title: "Scattered Audience", desc: "Your followers are spread across multiple networks with no single way to find all your work." },
           { icon: Share2, title: "One Link Limit", desc: "Social platforms only give you one bio link. Make it count by linking to a unified landing page." },
           { icon: DollarSign, title: "Lost Revenue", desc: "If they can't easily find your products, sponsors, or premium content—you're leaving money on the table." }
        ].map((item, i) => (
           <FadeIn key={i} delay={i * 0.1}>
             <div className="bg-[var(--bg-base)] p-8 rounded-2xl border border-[var(--border)] h-full flex flex-col items-center text-center">
               <div className="w-14 h-14 bg-[var(--bg-surface)] rounded-full flex items-center justify-center shadow-[var(--shadow-sm)] border border-[var(--border)] mb-6 text-[var(--accent)]">
                 <item.icon size={24} />
               </div>
               <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
               <p className="text-[var(--text-secondary)] font-medium leading-relaxed">{item.desc}</p>
             </div>
           </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Features = () => (
  <section className="py-32 px-6 md:px-12 bg-[var(--bg-base)] relative">
    <div className="max-w-6xl mx-auto">
      <FadeIn className="text-center mb-20">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-5">
          Everything You Need In One Place.
        </h2>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium">
          Stop duct-taping five tools together. CreatorHub provides the ultimate link-in-bio page, integrated with powerful building and analytics modules.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            icon: Layout,
            title: "Drag & Drop Builder",
            desc: "Construct beautiful pages in seconds. Add links, text, embedded videos, and images with an intuitive two-panel interface.",
          },
          {
            icon: Smartphone,
            title: "Mobile Optimized",
            desc: "Designed ground-up for mobile devices. Your profile looks incredible and loads blazingly fast on every screen size.",
          },
          {
            icon: BarChart2,
            title: "In-depth Analytics",
            desc: "Track page views, individual link clicks, and device breakdowns to understand exactly what your audience wants.",
          },
          {
            icon: DollarSign,
            title: "Seamless Monetization",
            desc: "Offer subscription tiers directly from your profile. Gate exclusive content blocks behind simple paywalls to start earning.",
          },
        ].map(({ icon: Icon, title, desc }, i) => (
          <FadeIn key={title} delay={i * 0.1}>
            <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 flex flex-col gap-4 hover:shadow-[var(--shadow-md)] hover:border-[var(--border-strong)] transition-all duration-300 h-full">
               <div className="w-12 h-12 rounded-xl bg-[var(--accent-muted)] flex items-center justify-center text-[var(--accent)]">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[var(--text-primary)] mb-2 tracking-tight">{title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed font-medium">{desc}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section className="py-32 px-6 md:px-12 bg-[var(--bg-surface)] border-y border-[var(--border)]">
    <div className="max-w-5xl mx-auto">
       <FadeIn className="text-center mb-16">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">Simple, Transparent Pricing</h2>
        <p className="text-lg text-[var(--text-secondary)] font-medium">Start for free, upgrade when you need superpowers.</p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {[
          {
            name: "Free",
            price: "₹0",
            period: "forever",
            desc: "Everything you need for a stunning profile.",
            features: ["Unlimited links & basic blocks", "Custom URL (creatorhub.co/name)", "3 curated themes", "Standard analytics"],
            cta: "Get Started Free",
            highlight: false,
          },
          {
            name: "Pro",
            price: "₹499",
            period: "per month",
            desc: "Advanced tools to monetize your audience.",
            features: [
              "Everything in Free",
              "Monetization & subscriptions",
              "Advanced analytics tracking",
              "Remove CreatorHub branding",
              "Premium embed blocks (Spotify, etc.)",
            ],
            cta: "Upgrade to Pro",
            highlight: true,
          },
        ].map((plan, i) => (
          <FadeIn key={plan.name} delay={i * 0.1}>
            <div
              className={`h-full rounded-2xl p-8 flex flex-col gap-6 transition-all ${
                plan.highlight
                  ? "bg-[var(--bg-surface)] border-[2px] border-[var(--accent)] shadow-[var(--shadow-accent)]"
                  : "bg-[var(--bg-surface)] border border-[var(--border)] shadow-[var(--shadow-sm)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-lg font-bold text-[var(--text-primary)]`}>{plan.name}</span>
                  {plan.highlight && (
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--accent)] text-[var(--text-inverse)]">
                      Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-black tracking-tight text-[var(--text-primary)]">{plan.price}</span>
                  <span className={`text-sm font-medium text-[var(--text-muted)]`}>/{plan.period}</span>
                </div>
                <p className={`text-sm mt-3 font-medium text-[var(--text-secondary)]`}>{plan.desc}</p>
              </div>

              <ul className="flex flex-col gap-3 flex-1 mt-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm font-medium">
                    <Check size={18} className={`shrink-0 mt-0.5 ${plan.highlight ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
                    <span className="text-[var(--text-primary)]">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-center transition-all mt-4 ${
                  plan.highlight
                    ? "bg-[var(--accent)] text-[var(--text-inverse)] hover:bg-[var(--accent-hover)]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
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
   <section className="py-24 px-6 md:px-12 bg-[var(--bg-base)] relative overflow-hidden text-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full opacity-[0.08] blur-[60px]" style={{ background: "radial-gradient(ellipse, #A05C3E, transparent)" }} />
      </div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tight">
          Ready to claim your corner of the internet?
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-10 font-medium">
          Join thousands of creators who are organizing their digital presence and earning on their own terms.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[var(--accent)] text-[var(--text-inverse)] font-bold text-lg hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-lg)]"
        >
          Create your page free
          <ArrowRight size={20} />
        </Link>
      </div>
   </section>
);

const Footer = () => (
  <footer className="bg-[var(--bg-surface)] border-t border-[var(--border)] py-12 px-6 md:px-12">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-[var(--accent)] flex items-center justify-center">
          <Zap size={12} className="text-[var(--text-inverse)]" />
        </div>
        <span className="font-display font-bold text-[var(--text-primary)] tracking-tight">CreatorHub</span>
      </div>
      <div className="flex items-center gap-6 text-sm font-medium text-[var(--text-muted)]">
        <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">Log in</Link>
        <Link to="/signup" className="hover:text-[var(--text-primary)] transition-colors">Sign up</Link>
        <span>© {new Date().getFullYear()} CreatorHub</span>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="bg-[var(--bg-base)] min-h-screen font-body selection:bg-[var(--accent-muted)] selection:text-[var(--accent)]">
      <Navbar />
      <Hero />
      <Problem />
      <Features />
      <Pricing />
      <CTABanner />
      <Footer />
    </div>
  );
}
