import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FileText, LogOut, User, Plus } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) =>
    location.pathname === path ? "text-ink" : "text-ink/40 hover:text-ink";

  return (
    <nav className="bg-paper border-b border-mist sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-ink">
          <FileText size={18} className="text-amber-500" />
          <span className="font-mono text-sm">collab<span className="text-amber-500">notes</span></span>
        </Link>

        {isAuthenticated && (
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/notes" className={`transition-colors ${isActive("/notes")}`}>
              My Notes
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/notes/new" className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4">
                <Plus size={15} /> New Note
              </Link>
              <Link to="/profile" className="p-2 rounded-lg text-ink/40 hover:text-ink transition-colors">
                <User size={17} />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-ink/40 hover:text-red-500 transition-colors"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-2 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
