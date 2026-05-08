"use client";

import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import { Leaf, Users, Zap, Globe, TrendingUp, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const stats = [
  { icon: Users, value: 12400, suffix: "+", label: "Active Members", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { icon: Zap, value: 3200, suffix: "+", label: "Ideas Submitted", color: "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]", bg: "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20" },
  { icon: Award, value: 890, suffix: "+", label: "Approved Ideas", color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { icon: Globe, value: 48, suffix: "", label: "Countries Reached", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { icon: TrendingUp, value: 95, suffix: "K+", label: "Votes Cast", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  { icon: Leaf, value: 2400, suffix: "t", label: "CO₂ Saved (est.)", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
];

export default function StatsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-muted/30 border-y border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, color, bg }, i) => (
            <MotionWrapper key={label} variant="scaleIn" delay={i * 0.08}>
              <Card className="flex flex-col items-center text-center p-6 border-none shadow-md hover:shadow-lg transition-shadow bg-background/60 backdrop-blur-sm">
                <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div className={`font-display text-3xl font-bold ${color}`}>
                  {inView ? <CountUp end={value} duration={2.5} separator="," suffix={suffix} /> : "0"}
                </div>
                <p className="text-muted-foreground text-sm mt-2 font-medium">{label}</p>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
