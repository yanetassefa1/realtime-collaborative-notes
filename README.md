# 📝 Real-Time Collaborative Notes

A Google Docs-style collaborative notes app where multiple users can edit 
the same note simultaneously in real time — featuring AI-powered note 
summarization built with the Claude API.

## 🌐 Live Demo
[View Live Demo](your-deployed-link-here)

## 🤖 AI Feature — Note Summarizer
Paste any long note and Claude will generate a clean, concise summary 
in seconds — perfect for meeting notes, research, and study guides.

## ✨ Features

### 📝 Real-Time Collaboration
- Multiple users edit the same note simultaneously
- Changes broadcast instantly to all connected users via WebSockets
- Live presence indicators — see who else is in the document
- Each note has its own collaboration room

### 🔐 Authentication
- Secure login and registration
- JWT token authentication
- Protected routes — only logged-in users can access notes

### 🤖 AI Note Summarizer
- Paste any long note or document
- Claude API returns a clean concise summary
- Great for meeting notes, lectures, and research

### 📁 Note Management
- Create, edit, and delete notes
- Multi-room support — each note is its own session
- Notes saved automatically to the database

## 🛠️ Tech Stack

**Frontend**
- React
- Tailwind CSS
- React Router DOM
- WebSocket API

**Backend**
- Python
- Django
- Django Channels
- WebSockets
- Django REST Framework
- PostgreSQL

**AI**
- Claude API (Anthropic)
- Prompt Engineering

**Auth**
- JWT Authentication

## 🚀 Getting Started
```bash
# Clone the repository
git clone https://github.com/yanetassefa1/realtime-collaborative-notes

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## 📁 Project Structure
```
realtime-collaborative-notes/
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # NoteEditor, PresenceIndicator
│   │   ├── pages/       # Dashboard, NoteRoom, Login
│   │   └── services/    # WebSocket client + Claude API
└── backend/             # Django app
    ├── notes/           # Note models + REST API
    ├── collaboration/   # Django Channels WebSocket consumer
    └── ai/              # Claude API summarization
```

## 📚 What I Learned
- Building real-time features with Django Channels and WebSockets
- Managing live state across multiple connected clients in React
- Integrating JWT authentication with WebSocket connections
- Using the Claude API for intelligent text summarization
- Designing a multi-room real-time architecture

## 🚧 Status
Currently in development — code coming soon.

## 📫 Contact
- GitHub: [yanetassefa1](https://github.com/yanetassefa1)
- LinkedIn: your-linkedin-url-here
```



Once committed, add these:

**Topics:**
```
react
django
python
websockets
django-channels
claude-api
ai
real-time
collaboration
jwt
