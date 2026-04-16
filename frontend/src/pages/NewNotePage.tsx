import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateNote } from "../hooks/useNotes";
import { ArrowLeft } from "lucide-react";

export default function NewNotePage() {
  const navigate = useNavigate();
  const createNote = useCreateNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createNote.mutateAsync({ title, content, tags, is_public: isPublic });
    navigate(`/notes/${res.data.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink mb-8 transition-colors"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <h1 className="text-3xl font-bold text-ink mb-8">New Note</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="card flex flex-col gap-4">
          <div>
            <label className="label">Title</label>
            <input
              className="input text-lg font-semibold"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              required
            />
          </div>
          <div>
            <label className="label">Content</label>
            <textarea
              className="input resize-none font-mono text-sm leading-relaxed"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
            />
          </div>
        </div>

        <div className="card flex flex-col gap-4">
          <div>
            <label className="label">Tags</label>
            <input
              className="input"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="design, frontend, research (comma-separated)"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm text-ink/60">Make this note public (anyone with the link can view)</span>
          </label>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={createNote.isLoading}>
            {createNote.isLoading ? "Creating..." : "Create Note"}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
