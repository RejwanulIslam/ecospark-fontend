"use client";

import { UserPlus, Lightbulb, CheckCircle, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MotionWrapper } from "@/components/ui/motion-wrapper";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Join the Community",
    description: "Sign up for free and become part of a global network of sustainability innovators and eco-enthusiasts.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-200 dark:border-blue-500/30",
    glow: "hover:shadow-blue-500/10",
  },
  {
    icon: Lightbulb,
    step: "02",
    title: "Share Your Idea",
    description: "Submit your sustainability idea with a detailed description, problem statement, and proposed solution.",
    color: "text-[var(--color-primary-600)] dark:text-[var(--color-primary-400)]",
    bg: "bg-[var(--color-primary-50)] dark:bg-[var(--color-primary-900)]/20",
    border: "border-[var(--color-primary-200)] dark:border-[var(--color-primary-800)]/50",
    glow: "hover:shadow-[var(--color-primary-500)]/10",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Admin Review",
    description: "Our expert admins review your idea. Approved ideas go live for the community; rejected ones get feedback.",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-200 dark:border-amber-500/30",
    glow: "hover:shadow-amber-500/10",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Vote & Collaborate",
    description: "Community members vote, comment, and collaborate. The best ideas rise to the top and inspire real action.",
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/30",
    glow: "hover:shadow-purple-500/10",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-muted/20 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-[var(--color-primary-300)] to-transparent opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper variant="slideUp" className="text-center mb-16">
          <Badge className="mb-4 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)] border-none px-4 py-1.5">
            How It Works
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            From Idea to Impact in 4 Steps
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Our streamlined process ensures the best ideas reach the right people.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-300 via-[var(--color-primary-300)] via-amber-300 to-purple-300 dark:from-blue-700 dark:via-[var(--color-primary-700)] dark:via-amber-700 dark:to-purple-700 opacity-60" />

          {steps.map((step, i) => (
            <MotionWrapper key={step.step} variant="slideUp" delay={i * 0.12}>
              <Card className={`flex flex-col items-center text-center p-8 border-2 ${step.border} hover:shadow-xl ${step.glow} transition-all duration-300 bg-background/80 backdrop-blur-sm h-full group`}>
                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl ${step.bg} border-2 ${step.border} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                  <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-background border-2 border-border flex items-center justify-center shadow-sm">
                    <span className={`text-xs font-bold ${step.color}`}>{i + 1}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-foreground text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
