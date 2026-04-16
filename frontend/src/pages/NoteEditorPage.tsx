import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNote, useUpdateNote } from "../hooks/useNotes";
import { useCollabSocket } from "../hooks/useCollabSocket";
import ActiveUsersBadge from "../components/ActiveUsersBadge";
import ShareModal from "../components/ShareModal";
import { ArrowLeft, Share2, Save, Globe, Lock } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: note, isLoading } = useNote(id!);
  const updateNote = useUpdateNote();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load initial note data
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setIsPublic(note.is_public);
    }
  }, [note]);

  // WebSocket real-time sync
  const handleRemoteUpdate = useCallback((newContent: string, newTitle: string) => {
    setContent(newContent);
    setTitle(newTitle);
  }, []);

  const { connected, activeUsers, sendUpdate } = useCollabSocket({
    noteId: id!,
    onContentUpdate: handleRemoteUpdate,
  });

  // Auto-save with debounce
  const triggerSave = useCallback(
    (newTitle: string, newContent: string) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        await updateNote.mutateAsync({ id: id!, title: newTitle, content: newContent, tags, is_public: isPublic });
        setLastSaved(new Date());
        setIsDirty(false);
      }, 1500);
    },
    [id, tags, isPublic]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
    sendUpdate(content, e.target.value);
    triggerSave(e.target.value, content);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
    sendUpdate(e.target.value, title);
    triggerSave(title, e.target.value);
  };

  const handleManualSave = async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await updateNote.mutateAsync({ id: id!, title, content, tags, is_public: isPublic });
    setLastSaved(new Date());
    setIsDirty(false);
  };

  const isOwner = user?.id === note?.owner;

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!note) return <div className="p-8 text-center text-ink/40">Note not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center gap-1.5 text-sm text-ink/40 hover:text-ink transition-colors"
        >
          <ArrowLeft size={15} /> All Notes
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <ActiveUsersBadge users={activeUsers} connected={connected} />

          {lastSaved && (
            <span className="text-xs font-mono text-ink/30">
              {isDirty ? "Saving..." : `Saved ${formatDistanceToNow(lastSaved, { addSuffix: true })}`}
            </span>
          )}

          <button
            onClick={handleManualSave}
            disabled={updateNote.isLoading}
            className="btn-ghost text-sm py-1.5 px-3 flex items-center gap-1.5"
          >
            <Save size={14} /> Save
          </button>

          {isOwner && (
            <button
              onClick={() => setShowShare(true)}
              className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1.5"
            >
              <Share2 size={14} /> Share
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-mist">
          <input
            className="flex-1 text-2xl font-bold text-ink bg-transparent outline-none placeholder-ink/20"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled"
          />
          <button
            onClick={async () => {
              const newPublic = !isPublic;
              setIsPublic(newPublic);
              await updateNote.mutateAsync({ id: id!, is_public: newPublic });
            }}
            className="text-ink/30 hover:text-amber-500 transition-colors"
            title={isPublic ? "Make private" : "Make public"}
          >
            {isPublic ? <Globe size={16} /> : <Lock size={16} />}
          </button>
        </div>

        <textarea
          className="w-full min-h-[60vh] bg-transparent outline-none text-ink font-mono text-sm leading-relaxed resize-none placeholder-ink/20"
          value={content}
          onChange={handleContentChange}
          placeholder="Start writing... (Markdown supported)"
        />

        <div className="pt-4 border-t border-mist">
          <label className="label">Tags</label>
          <input
            className="input text-sm"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, research, notes (comma-separated)"
            onBlur={handleManualSave}
          />
        </div>
      </div>

      {showShare && (
        <ShareModal noteId={id!} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
