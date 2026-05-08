"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Environmental Engineer",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=sarah",
    rating: 5,
    text: "EcoSpark Hub helped me connect with like-minded innovators. My solar micro-grid idea got approved and now serves 300 families in rural communities!",
    idea: "Community Solar Initiative",
  },
  {
    name: "Marcus Johnson",
    role: "Urban Planner",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=marcus",
    rating: 5,
    text: "The voting system is brilliant — it surfaces the best ideas organically. I discovered composting solutions I never would have found otherwise.",
    idea: "Urban Composting Network",
  },
  {
    name: "Priya Patel",
    role: "Sustainability Consultant",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=priya",
    rating: 5,
    text: "The admin feedback process is constructive and professional. Even rejected ideas come back stronger. This platform genuinely improves ideas.",
    idea: "Zero-Waste Office Program",
  },
  {
    name: "David Kim",
    role: "Renewable Energy Researcher",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=david",
    rating: 5,
    text: "I've found collaborators, investors, and friends through EcoSpark. The community here is passionate and action-oriented.",
    idea: "Wind Energy Cooperatives",
  },
  {
    name: "Amara Osei",
    role: "Climate Activist",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=amara",
    rating: 5,
    text: "Submitting my water harvesting idea was seamless. The structured format helped me articulate my proposal better than I ever had before.",
    idea: "Rooftop Water Collection",
  },
  {
    name: "Lena Müller",
    role: "Green Tech Entrepreneur",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=lena",
    rating: 5,
    text: "The paid ideas feature lets me monetize my research while still contributing to the community. A genius model for sustainability innovation.",
    idea: "EV Charging Cooperatives",
  },
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-4">
            Community Stories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Real stories from community members who are making a difference.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-200 dark:border-gray-700/60 p-6 hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-700/50 transition-all duration-300 card-hover"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-primary-100 dark:text-primary-900/50" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5 relative z-10">
                &quot;{t.text}&quot;
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/20"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
                <span className="shrink-0 text-xs px-2 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium">
                  💡 {t.idea}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
