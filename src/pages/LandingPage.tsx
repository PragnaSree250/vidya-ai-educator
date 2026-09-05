import { Link } from 'react-router-dom'
import { MarketingNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import {
  Clapperboard,
  Globe2,
  GraduationCap,
  MessageCircleQuestion,
  Sparkles,
  Upload,
} from 'lucide-react'

const steps = [
  'Understand',
  'Plan',
  'Explain',
  'Demonstrate',
  'Question',
  'Evaluate',
  'Adapt',
  'Continue',
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_at_10%_-10%,#EEF2FF,transparent),radial-gradient(800px_at_90%_0%,#F0FDFA,transparent)]">
      <MarketingNav />
      <main className="container-page pb-20">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
          <div>
            <Badge>AI Innovation Hackathon · frontend prototype</Badge>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ink-900 sm:text-5xl">
              A human-like AI teacher that actually teaches — through video.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Upload a textbook or name a topic. Vidya plans the lesson, explains with an avatar and
              voice, asks you questions, spots misconceptions, and tells you what to revise next.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/signup">
                <Button size="lg">Start a 20-minute lesson</Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="secondary">
                  View student demo
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Not a chatbot. Understand → Plan → Explain → Demonstrate → Question → Adapt.
            </p>
          </div>
          <Card className="relative overflow-hidden bg-ink-950 text-white">
            <p className="text-xs uppercase tracking-wider text-indigo-300">Live classroom preview</p>
            <p className="mt-2 font-display text-2xl">Chapter 4 · Electricity · Hindi · 20 min</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-teal-500 font-display text-xl ring-4 ring-sun-400/40">
                M
              </div>
              <div>
                <p className="font-medium">Meera · calm mentor</p>
                <p className="text-sm text-indigo-200">Avatar + voice · circuit board visuals</p>
              </div>
            </div>
            <p className="mt-4 rounded-xl bg-white/10 p-3 text-sm">
              “Voltage same rahe aur resistance badhe, to current kam hoga. Darwaza patla ho to kam log nikalte
              hain.”
            </p>
            <div className="mt-4 rounded-xl bg-white p-3 text-slate-800">
              <p className="text-xs font-medium text-slate-500">Check-in question</p>
              <p className="mt-1 text-sm">What happens to current if resistance increases?</p>
            </div>
          </Card>
        </section>

        <section id="how" className="py-8">
          <h2 className="font-display text-3xl">How Vidya teaches</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-brand-600">0{i + 1}</p>
                <p className="mt-1 font-medium">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Upload, t: 'Learn from your material', d: 'PDF, notes, PPT, research papers — chapters and concepts extracted.' },
            { icon: Sparkles, t: 'Or start from a topic', d: '“Teach me AI from the beginning” becomes a structured path.' },
            { icon: Clapperboard, t: 'Video classroom', d: 'Avatar, voice, on-screen text, diagrams — not a talking script.' },
            { icon: MessageCircleQuestion, t: 'Interactive checks', d: 'MCQs, short answers, “explain in your own words.”' },
            { icon: GraduationCap, t: 'Adaptive teaching', d: 'Wrong answers trigger a new analogy, not a red tick.' },
            { icon: Globe2, t: 'Multilingual', d: 'English textbook, Hindi lesson — context stays when you switch.' },
          ].map((f) => (
            <Card key={f.t}>
              <f.icon className="h-5 w-5 text-brand-600" />
              <h3 className="mt-3 font-display text-xl">{f.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.d}</p>
            </Card>
          ))}
        </section>

        <section id="languages" className="rounded-3xl bg-white p-8 shadow-card">
          <h2 className="font-display text-3xl">Languages in this prototype</h2>
          <p className="mt-2 text-slate-600">
            English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Spanish, French. Teaching language can
            differ from the uploaded file.
          </p>
        </section>
      </main>
    </div>
  )
}
