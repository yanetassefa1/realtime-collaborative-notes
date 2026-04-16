# Real-Time Collaborative Notes

A full-stack real-time collaborative note-taking app where multiple users can create, edit, and share notes simultaneously. Built with React, TypeScript, Django Channels (WebSockets), and PostgreSQL/Supabase.

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite, WebSocket API  
**Backend:** Python, Django, Django Channels, Django REST Framework  
**Database:** PostgreSQL (Supabase)  
**Real-time:** WebSockets via Django Channels + Redis  
**Auth:** JWT (SimpleJWT)

---

## Project Structure

```
realtime-collaborative-notes/
├── frontend/     # React + TypeScript app
├── backend/      # Django + Channels API
└── README.md
```

---

## Getting Started

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

cp .env.example .env
# Fill in your DB and Redis credentials

python manage.py migrate
python manage.py runserver
```

> Requires Redis running locally: `redis-server`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

---

## Features

- 📝 Create, edit, and delete notes in real time
- 👥 See live cursors and edits from other collaborators
- 🔗 Share notes with a unique link
- 🔐 Private notes + shared notes per user
- 🏷️ Tag and search notes
- 💾 Auto-save with conflict-free syncing via WebSockets
- 🔐 JWT authentication

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register |
| POST | `/api/auth/login/` | Login |
| GET | `/api/notes/` | List user's notes |
| POST | `/api/notes/` | Create note |
| GET | `/api/notes/:id/` | Get note |
| PATCH | `/api/notes/:id/` | Update note |
| DELETE | `/api/notes/:id/` | Delete note |
| POST | `/api/notes/:id/share/` | Share note |

## WebSocket

Connect to `ws://localhost:8000/ws/notes/<note_id>/` to stream real-time edits.

---

## License

MIT
