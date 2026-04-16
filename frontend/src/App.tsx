import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotesPage from "./pages/NotesPage";
import NewNotePage from "./pages/NewNotePage";
import NoteEditorPage from "./pages/NoteEditorPage";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/notes"
              element={<ProtectedRoute><NotesPage /></ProtectedRoute>}
            />
            <Route
              path="/notes/new"
              element={<ProtectedRoute><NewNotePage /></ProtectedRoute>}
            />
            <Route
              path="/notes/:id"
              element={<ProtectedRoute><NoteEditorPage /></ProtectedRoute>}
            />
          </Routes>
        </main>
        <footer className="border-t border-mist text-center text-xs font-mono text-ink/20 py-5">
          collabnotes · built with React & Django Channels
        </footer>
      </div>
    </AuthProvider>
  );
}
