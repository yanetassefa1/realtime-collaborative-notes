import { useState } from "react";
import { useShareNote } from "../hooks/useNotes";
import { X, UserPlus } from "lucide-react";

interface Props {
  noteId: string;
  onClose: () => void;
}

export default function ShareModal({ noteId, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const shareNote = useShareNote();

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await shareNote.mutateAsync({ id: noteId, email });
      setSuccess(`Note shared with ${email}!`);
      setEmail("");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to share note.");
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <UserPlus size={16} className="text-amber-500" />
            Share Note
          </h2>
          <button onClick={onClose} className="text-ink/30 hover:text-ink transition-colors">
            <X size={18} />
          </button>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-lg mb-4">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleShare} className="flex flex-col gap-3">
          <div>
            <label className="label">Collaborator Email</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={shareNote.isLoading}>
            {shareNote.isLoading ? "Sharing..." : "Send Invite"}
          </button>
        </form>

        <p className="text-xs text-ink/30 mt-3 text-center">
          They'll get instant access to edit this note in real time.
        </p>
      </div>
    </div>
  );
}
