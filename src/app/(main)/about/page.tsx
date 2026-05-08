import { Leaf, Target, Heart, Globe, Users, Lightbulb } from "lucide-react";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary-500/20 border border-primary-500/30 mb-6">
            <Leaf className="w-10 h-10 text-primary-400" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold mb-5">
            About <span className="gradient-text">EcoSpark Hub</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A community-powered platform where sustainability ideas spark real environmental change. We connect innovators, activists, and changemakers worldwide.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", desc: "To democratize sustainability innovation by giving every person a platform to share impactful eco-friendly ideas and collaborate on real solutions.", color: "text-primary-600", bg: "bg-primary-50 dark:bg-primary-900/20" },
              { icon: Heart, title: "Our Values", desc: "Community, transparency, environmental responsibility, and equal access to knowledge drive everything we do at EcoSpark Hub.", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
              { icon: Globe, title: "Our Vision", desc: "A world where the best sustainability ideas reach the people who need them most — regardless of geography, wealth, or status.", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
            <p className="text-gray-500 dark:text-gray-400">Passionate individuals working toward a sustainable future.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Alex Green", role: "CEO & Founder", seed: "alex", specialty: "Climate Tech" },
              { name: "Maya Chen", role: "CTO", seed: "maya", specialty: "Full-Stack Dev" },
              { name: "Omar Hassan", role: "Head of Community", seed: "omar", specialty: "Sustainability" },
              { name: "Lena Braun", role: "Design Lead", seed: "lena", specialty: "UX & Brand" },
            ].map((person) => (
              <div key={person.name} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
                <img
                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${person.seed}`}
                  alt={person.name}
                  className="w-20 h-20 rounded-2xl mx-auto mb-3 bg-primary-50 dark:bg-primary-900/20"
                />
                <h4 className="font-display font-bold text-gray-900 dark:text-white text-sm">{person.name}</h4>
                <p className="text-primary-600 dark:text-primary-400 text-xs font-medium">{person.role}</p>
                <p className="text-gray-400 text-xs mt-1">{person.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-10">Our Impact So Far</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "12K+", label: "Community Members", icon: Users },
              { value: "3.2K+", label: "Ideas Shared", icon: Lightbulb },
              { value: "48", label: "Countries", icon: Globe },
              { value: "2.4K t", label: "CO₂ Saved (est.)", icon: Leaf },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
                <p className="font-display text-2xl font-extrabold text-primary-700 dark:text-primary-400">{value}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
