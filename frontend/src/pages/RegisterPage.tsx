import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { FileText } from "lucide-react";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "", username: "", first_name: "", last_name: "", password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/register/", form);
      await login(form.email, form.password);
      navigate("/notes");
    } catch (err: any) {
      const msg = err?.response?.data;
      setError(typeof msg === "object" ? Object.values(msg).flat().join(" ") : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="bg-amber-50 p-3 rounded-2xl border border-amber-100">
            <FileText size={24} className="text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-ink">Create account</h1>
          <p className="text-sm text-ink/40">Start taking collaborative notes</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input name="first_name" className="input" value={form.first_name}
                onChange={handleChange} placeholder="Jane" required />
            </div>
            <div>
              <label className="label">Last name</label>
              <input name="last_name" className="input" value={form.last_name}
                onChange={handleChange} placeholder="Doe" required />
            </div>
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" className="input" value={form.email}
              onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div>
            <label className="label">Username</label>
            <input name="username" className="input" value={form.username}
              onChange={handleChange} placeholder="janedoe" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" className="input" value={form.password}
              onChange={handleChange} placeholder="Min. 8 characters" minLength={8} required />
          </div>
          <button type="submit" className="btn-primary w-full mt-1" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-center text-ink/40 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-600 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
