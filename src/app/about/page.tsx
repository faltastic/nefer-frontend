import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Users, 
  Target, 
  Star, 
  Lightbulb, 
  Cards, 
  Robot, 
  MagnifyingGlass, 
  CheckCircle 
} from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "About | Nefer",
  description: "Learn about Nefer, the curated digital scene for independent talents.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-zinc-950 border-b border-zinc-900 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <Badge className="bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/50 border-emerald-800/50 mb-6 py-1.5 px-4 text-sm font-semibold rounded-full">
            Our Vision
          </Badge>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-50 mb-6 leading-tight">
            The AI-powered scene for{" "}
            <span className="text-emerald-500">creative collaborations.</span>
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            Nefer is a powerful engine connecting Photographers, Models, and
            Brands through intelligent matching and automated profile curation.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Our Core Pillars
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              The principles that guide everything we build at Nefer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Users size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3">Priority: People</h3>
              <p className="text-zinc-400 leading-relaxed">
                We prioritize quality human connections and raw talent over
                infinite scrolling algorithms.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Target size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3">Goal: Visibility</h3>
              <p className="text-zinc-400 leading-relaxed">
                We exist to amplify the reach of independent professionals,
                getting their work in front of the right eyes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Star size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3">Values: Respect</h3>
              <p className="text-zinc-400 leading-relaxed">
                We foster a community built on mutual respect, constructive
                support, and professional integrity.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
              <div className="w-14 h-14 bg-emerald-950/50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                <Lightbulb size={32} weight="fill" />
              </div>
              <h3 className="text-xl font-bold mb-3">Innovation: Tech</h3>
              <p className="text-zinc-400 leading-relaxed">
                We integrate bleeding-edge technology to solve the ancient
                problem of being discovered.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Profile Card Section */}
      <section className="py-24 px-4 bg-zinc-950 border-y border-zinc-900">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-800 border-none px-3 py-1">
                The Solution
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                The <span className="text-emerald-500">Nefer Card</span> Concept
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed">
                In an era of plummeting attention spans, expecting clients to
                dig through multi-page portfolios is no longer viable.
              </p>
              <p className="text-lg text-zinc-400 leading-relaxed">
                The Nefer Card acts as your mini digital billboard—a heavily
                optimized "link-in-bio" that provides a stunning, instantaneous
                overview of your creative identity.{" "}
                <strong>Generated automatically from your existing URLs</strong>
                , it strips away the noise and leaves only impact.
              </p>

              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <Robot size={24} weight="fill" className="text-emerald-500" />
                  Intelligent Matching
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Our engine doesn't just host your profile; it works for you.
                  Every week, Nefer sends{" "}
                  <strong>keyword-based collaboration suggestions</strong> via
                  email, surfacing rising talent and matching you with exactly
                  the right partners for your next project.
                </p>
              </div>

              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle
                    size={24}
                    weight="fill"
                    className="text-emerald-500 flex-shrink-0"
                  />
                  <span>Instant portfolio summarization via AI</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle
                    size={24}
                    weight="fill"
                    className="text-emerald-500 flex-shrink-0"
                  />
                  <span>Curated high-impact gallery layout</span>
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle
                    size={24}
                    weight="fill"
                    className="text-emerald-500 flex-shrink-0"
                  />
                  <span>Actionable booking & social links</span>
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full" />
              <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-center min-h-[400px]">
                <Cards size={120} weight="thin" className="text-zinc-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-[2.5rem]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI & SEO Section */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Engineered for{" "}
            <span className="text-emerald-500">Discoverability</span>
          </h2>
          <p className="text-xl text-zinc-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            Having a great portfolio is useless if no one sees it. We structure
            your data so you don't just exist; you show up where it matters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800/50">
              <MagnifyingGlass
                size={48}
                weight="duotone"
                className="text-emerald-500 mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">Semantic SEO</h3>
              <p className="text-zinc-400 leading-relaxed">
                Every profile is deeply optimized for traditional search
                engines. We translate your visual aesthetic into structured
                metadata that Google understands and ranks.
              </p>
            </div>

            <div className="bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800/50">
              <Robot
                size={48}
                weight="duotone"
                className="text-emerald-500 mb-6"
              />
              <h3 className="text-2xl font-bold mb-4">LLM Optimization</h3>
              <p className="text-zinc-400 leading-relaxed">
                As discovery moves to AI chats, we format your Nefer Card so
                tools like ChatGPT, Gemini, and Perplexity can easily read,
                recommend, and cite your work to users searching for creatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-emerald-950/20 border-t border-zinc-900 mt-auto">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Focus on what you love.
          </h2>
          <p className="text-lg text-zinc-400 mb-10 leading-relaxed">
            Let us handle the technology, the SEO, and the formatting. You just
            keep creating incredible work.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/join">
              <Button
                size="lg"
                className="rounded-full px-10 h-14 text-lg font-bold w-full sm:w-auto bg-fuchsia-600"
              >
                Apply for a Profile
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-10 h-14 text-lg font-bold w-full sm:w-auto border-zinc-700 hover:bg-zinc-800"
              >
                Explore the Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
