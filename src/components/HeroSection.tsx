import { motion } from "framer-motion";
import { Upload, Play, BookOpen, ArrowRight, Zap } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-accent/10 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      <div className="section-container relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-sm text-primary mb-6"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Healthcare EDI Analysis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
          >
            <span className="text-foreground">AI Powered </span>
            <span className="gradient-text">EDI Parser</span>
            <span className="text-foreground"> & Validator</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Upload healthcare EDI files and instantly detect errors, visualize data structure, and get AI-powered explanations. Support for 837, 835, and 834 transactions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-primary-foreground font-semibold text-sm glow-effect transition-transform hover:scale-105"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Upload className="w-4 h-4" />
              Upload EDI File
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              <Play className="w-4 h-4" />
              Try Interactive Demo
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-muted-foreground text-sm hover:text-foreground transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              View Documentation
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
