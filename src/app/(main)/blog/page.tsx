import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const metadata = { title: "Blog" };

const posts = [
  {
    slug: "top-10-solar-energy-innovations",
    title: "Top 10 Solar Energy Innovations Changing Our World",
    excerpt: "From perovskite solar cells to floating solar farms, discover the breakthroughs making clean energy more accessible and affordable than ever before.",
    category: "Energy",
    date: "2026-04-15",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
    color: "#F59E0B",
  },
  {
    slug: "zero-waste-city-blueprint",
    title: "The Zero-Waste City Blueprint: How San Francisco Did It",
    excerpt: "Learn how San Francisco achieved an 80% landfill diversion rate and what other cities can replicate from their comprehensive waste reduction strategy.",
    category: "Waste",
    date: "2026-04-08",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
    color: "#10B981",
  },
  {
    slug: "urban-farming-revolution",
    title: "The Urban Farming Revolution: Growing Food in Unexpected Places",
    excerpt: "Rooftops, vacant lots, and repurposed buildings are becoming food production hubs. We explore the most innovative urban agriculture projects worldwide.",
    category: "Agriculture",
    date: "2026-04-01",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1595429035839-c99c298ffdde?w=800",
    color: "#84CC16",
  },
  {
    slug: "electric-mobility-future",
    title: "Electric Mobility: Beyond Cars to a Complete Transportation Shift",
    excerpt: "E-bikes, electric ferries, solar-powered trains — the electrification of transport goes far beyond EVs. Here's the full picture of what's coming.",
    category: "Transportation",
    date: "2026-03-25",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    color: "#3B82F6",
  },
  {
    slug: "water-scarcity-solutions",
    title: "Innovative Solutions to the Global Water Scarcity Crisis",
    excerpt: "From atmospheric water generators to advanced desalination, communities are finding creative ways to secure clean water for the future.",
    category: "Water",
    date: "2026-03-18",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
    color: "#06B6D4",
  },
  {
    slug: "community-action-climate",
    title: "Why Community Action Is the Most Powerful Climate Tool We Have",
    excerpt: "Individual actions matter, but collective community-driven projects amplify impact by orders of magnitude. Here's the data and the stories.",
    category: "Community",
    date: "2026-03-10",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
    color: "#8B5CF6",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold mb-4">
            EcoSpark Blog
          </span>
          <h1 className="font-display text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Insights for a Greener World
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Expert insights, community stories, and deep dives into the sustainability innovations shaping our future.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        {/* Featured post */}
        <div className="mb-10">
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-xl mb-5">Featured Article</h2>
          <Link href={`/blog/${featured.slug}`} className="group block bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-600/50 transition-all card-hover">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative h-56 md:h-auto overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-7 flex flex-col justify-center">
                <div
                  className="inline-block px-3 py-1 rounded-lg text-xs font-semibold mb-3"
                  style={{ backgroundColor: featured.color + "22", color: featured.color }}
                >
                  {featured.category}
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-xl mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {featured.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {featured.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {featured.readTime} read</span>
                  </div>
                  <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium group-hover:gap-2 transition-all">
                    Read more <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Other posts */}
        <h2 className="font-display font-bold text-gray-900 dark:text-white text-xl mb-5">More Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-600/50 transition-all card-hover flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div
                  className="inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold mb-3 self-start"
                  style={{ backgroundColor: post.color + "22", color: post.color }}
                >
                  {post.category}
                </div>
                <h3 className="font-display font-bold text-gray-900 dark:text-white text-sm leading-snug mb-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
