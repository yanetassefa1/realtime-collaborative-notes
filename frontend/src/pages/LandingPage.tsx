import { Link } from "react-router-dom";
import { FileText, Users, Zap, Lock } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Real-time sync", desc: "See every keystroke from collaborators instantly via WebSockets." },
  { icon: Users, title: "Live cursors", desc: "Know who's editing and where with live presence indicators." },
  { icon: FileText, title: "Rich notes", desc: "Write in Markdown, tag your notes, and search across everything." },
  { icon: Lock, title: "Private by default", desc: "Notes are private until you choose to share or make them public." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="min-h-[80vh] flex items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-6 max-w-2xl">
          <div className="bg-amber-50 p-4 rounded-3xl border border-amber-100 mb-2">
            <FileText size={36} className="text-amber-500" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-ink leading-tight">
            Notes that think<br />
            <span className="text-amber-500">together.</span>
          </h1>
          <p className="text-ink/50 text-lg max-w-md leading-relaxed">
            Write, collaborate, and share notes with your team in real time.
            No lag. No conflicts. Just flow.
          </p>
          <div className="flex gap-3 mt-2">
            <Link to="/register" className="btn-primary px-8 py-3 text-base">
              Start Writing Free
            </Link>
            <Link to="/login" className="btn-ghost px-8 py-3 text-base">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16 w-full">
        <div className="grid sm:grid-cols-2 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card flex gap-4 items-start hover:shadow-md transition-shadow">
              <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl shrink-0">
                <Icon size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-1">{title}</h3>
                <p className="text-sm text-ink/50 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-mist py-16 px-4 text-center bg-white">
        <h2 className="text-3xl font-bold text-ink mb-3">Ready to collaborate?</h2>
        <p className="text-ink/40 mb-8 text-sm">Free forever. No credit card needed.</p>
        <Link to="/register" className="btn-primary px-10 py-3 text-base">
          Create Free Account
        </Link>
      </section>
    </div>
  );
}
