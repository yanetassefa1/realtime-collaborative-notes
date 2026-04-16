import { ActiveUser } from "../utils/types";

interface Props {
  users: ActiveUser[];
  connected: boolean;
}

export default function ActiveUsersBadge({ users, connected }: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-gray-300"}`} />
      <span className="text-xs font-mono text-ink/40">
        {connected ? "live" : "connecting..."}
      </span>
      {users.length > 0 && (
        <div className="flex items-center -space-x-1.5">
          {users.map((u) => (
            <div
              key={u.user_id}
              className="w-6 h-6 rounded-full border-2 border-paper flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: u.color }}
              title={u.username}
            >
              {u.username[0]?.toUpperCase()}
            </div>
          ))}
          <span className="ml-2 text-xs text-ink/40 font-mono">
            {users.length} editing
          </span>
        </div>
      )}
    </div>
  );
}
