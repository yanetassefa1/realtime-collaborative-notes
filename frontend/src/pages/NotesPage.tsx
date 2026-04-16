import { useState } from "react";
import { Link } from "react-router-dom";
import { useNotes } from "../hooks/useNotes";
import NoteCard from "../components/NoteCard";
import { Search, Plus, FileText } from "lucide-react";

export default function NotesPage() {
  const [search, setSearch] = useState("");
  const { data: notes, isLoading } = useNotes(search);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-ink">My Notes</h1>
          <p className="text-sm text-ink/40 mt-1">
            {notes?.length ?? 0} note{notes?.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/notes/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> New Note
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" />
        <input
          type="text"
          className="input pl-10"
          placeholder="Search notes by title, content, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {notes && notes.length === 0 && (
        <div className="card text-center py-20 flex flex-col items-center gap-4">
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
            <FileText size={32} className="text-amber-400" />
          </div>
          <h2 className="font-semibold text-ink text-lg">No notes yet</h2>
          <p className="text-sm text-ink/40 max-w-xs">
            Create your first note and start collaborating with your team in real time.
          </p>
          <Link to="/notes/new" className="btn-primary mt-2">
            Create First Note
          </Link>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes?.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
}
