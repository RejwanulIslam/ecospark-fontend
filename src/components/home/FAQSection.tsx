"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { MotionWrapper } from "@/components/ui/motion-wrapper";
import { Badge } from "@/components/ui/badge";

const faqs = [
  {
    question: "What is EcoSpark?",
    answer: "EcoSpark is a community-driven platform where individuals and organizations can share, discover, and fund innovative sustainability ideas and eco-friendly projects.",
  },
  {
    question: "How do I submit an idea?",
    answer: "You can submit an idea by creating an account, navigating to your dashboard, and clicking the 'New Idea' button. Follow the prompts to detail your project.",
  },
  {
    question: "What happens when my idea is approved?",
    answer: "Once approved by our admins, your idea becomes public on the platform. Other users can vote, comment, share, and even fund your idea if you set it as a paid or funded project.",
  },
  {
    question: "Is it free to join?",
    answer: "Yes! Joining the EcoSpark community and sharing your ideas is completely free. We also offer premium features for users who want to monetize their projects.",
  },
  {
    question: "How does the voting system work?",
    answer: "Users can upvote ideas they like and downvote ones they don't. Ideas with higher net votes are featured on our trending and top-voted sections for greater visibility.",
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary-500)]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <MotionWrapper variant="slideUp" className="text-center mb-12">
          <Badge className="mb-4 bg-[var(--color-primary-100)] text-[var(--color-primary-700)] dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)] border-none">
            <HelpCircle size={14} className="mr-1" /> Frequently Asked Questions
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about the platform and how it works.
          </p>
        </MotionWrapper>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <MotionWrapper key={index} variant="slideUp" delay={index * 0.1}>
                <div 
                  className={`border border-border rounded-2xl overflow-hidden bg-card transition-all duration-300 ${isOpen ? 'shadow-md border-[var(--color-primary-300)] dark:border-[var(--color-primary-700)]' : 'hover:border-[var(--color-primary-200)] dark:hover:border-[var(--color-primary-800)]'}`}
                >
                  <button
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-semibold text-foreground text-lg pr-8">{faq.question}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-600)] rotate-180 dark:bg-[var(--color-primary-900)]/30 dark:text-[var(--color-primary-400)]' : 'bg-muted text-muted-foreground'}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>
                  
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
