import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FileText } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/notes");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <FileText size={24} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
          <p className="text-sm text-ink/40">Sign in to your notes</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email}
              onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" className="input" value={password}
              onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-ink/40 mt-5">
          No account?{" "}
          <Link to="/register" className="text-amber-600 hover:underline font-medium">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
