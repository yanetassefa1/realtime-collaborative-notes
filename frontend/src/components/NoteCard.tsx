import { Link } from "react-router-dom";
import { Note } from "../utils/types";
import { Users, Globe, Lock, Trash2, Clock } from "lucide-react";
import { useDeleteNote } from "../hooks/useNotes";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../hooks/useAuth";

interface Props {
  note: Note;
}

export default function NoteCard({ note }: Props) {
  const deleteNote = useDeleteNote();
  const { user } = useAuth();
  const isOwner = user?.id === note.owner;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm(`Delete "${note.title}"?`)) {
      deleteNote.mutate(note.id);
    }
  };

  const tags = note.tags ? note.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const preview = note.content?.replace(/\n/g, " ").slice(0, 120);

  return (
    <Link to={`/notes/${note.id}`} className="card block hover:shadow-md transition-all hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-ink group-hover:text-amber-600 transition-colors line-clamp-1">
          {note.title || "Untitled"}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {note.is_public
            ? <Globe size={13} className="text-ink/30" />
            : <Lock size={13} className="text-ink/30" />}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="text-ink/20 hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {preview && (
        <p className="text-sm text-ink/50 line-clamp-2 mb-3 leading-relaxed">{preview}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-xs font-mono bg-mist text-ink/60 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-ink/30 font-mono mt-auto pt-2 border-t border-mist">
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
        </span>
        {note.collaborator_count > 0 && (
          <span className="flex items-center gap-1">
            <Users size={10} />
            {note.collaborator_count} collaborator{note.collaborator_count !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </Link>
  );
}
