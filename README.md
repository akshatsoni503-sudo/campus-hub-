# 🏫 Campus Hub

> Everything happening on your campus. In one place.

Campus Hub is a trusted college ecosystem platform where verified students and authorized event managers can discover campus events, find and join teams, follow college clubs, get personalized event recommendations, and interact with an AI Campus Copilot.

## ✨ Features

- **🎓 Student Registration & Verification** — Multi-step registration with college ID upload and email verification
- **📅 Event Discovery** — Browse, search, and filter campus events by category, skills, and interests
- **🤖 AI Match** — Dynamic compatibility scoring based on your skills, interests, branch, and year
- **👥 Team Building** — Create teams, find teammates, and manage join requests
- **🏢 Club Management** — Follow clubs, receive announcements, explore club events
- **🤖 Campus Copilot** — AI assistant supporting English, Hindi, and Hinglish queries
- **🔒 Trust System** — College identity verification with admin approval workflow
- **📊 Admin Dashboard** — Manage users, verifications, events, and platform statistics
- **🔔 Notifications** — Real-time notifications for registrations, deadlines, and team requests
- **👤 Rich Profiles** — Skills, interests, certificates, projects, hackathon history

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, Lucide React |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Auth | JWT, bcryptjs |
| File Upload | Multer |
| Validation | Zod |

## 📁 Project Structure

```
campus-hub/
├── client/                    # React frontend
│   └── src/
│       ├── components/        # UI and layout components
│       ├── pages/             # Route pages
│       ├── hooks/             # Custom hooks
│       ├── services/          # API client
│       ├── context/           # Auth, Toast contexts
│       ├── types/             # TypeScript interfaces
│       └── utils/             # Helpers
├── server/                    # Express backend
│   └── src/
│       ├── routes/            # API routes
│       ├── middleware/        # Auth, upload, validation
│       ├── services/          # Business logic
│       └── utils/             # Helpers
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo data
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

```bash
# From project root
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Database Setup

```bash
# From server directory
npx prisma generate
npx prisma migrate dev --name init

# Seed demo data
npx tsx ../prisma/seed.ts
```

### 4. Run Development

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Prisma Studio: `npx prisma studio` (from server/)

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campushub.com | Admin@123 |
| Student | rahul@college.edu | Student@123 |
| Event Manager | priya@college.edu | Manager@123 |

**Demo OTP Code:** `123456` (for email verification)

## 🌐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/campushub |
| JWT_SECRET | JWT signing secret | (required) |
| JWT_EXPIRES_IN | Token expiry | 7d |
| PORT | Backend port | 5000 |
| CORS_ORIGIN | Frontend URL | http://localhost:5173 |
| SMTP_HOST | Email server (optional) | - |
| AI_API_KEY | OpenAI API key (optional) | - |

## 🔒 Security

- Password hashing with bcryptjs (10 rounds)
- JWT-based authentication
- Role-based access control (STUDENT, EVENT_MANAGER, ADMIN)
- Verification middleware
- File type and size validation
- Input validation with Zod
- Protected API routes
- CORS configuration

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `POST /api/auth/verify-email` — Verify email OTP
- `POST /api/auth/upload-college-id` — Upload verification document
- `GET /api/auth/me` — Get current user

### Events
- `GET /api/events` — List events
- `GET /api/events/recommended` — Personalized recommendations
- `GET /api/events/:id` — Event details
- `GET /api/events/:id/compatibility` — Match calculation
- `POST /api/events/:id/register` — Register for event

### Teams
- `GET /api/teams` — List teams
- `POST /api/teams` — Create team
- `POST /api/teams/:id/join` — Request to join
- `PUT /api/teams/:id/requests/:rid` — Accept/reject request

### Clubs
- `GET /api/clubs` — List clubs
- `POST /api/clubs/:id/follow` — Follow/unfollow

### AI Copilot
- `POST /api/copilot/chat` — Send message
- `GET /api/copilot/chats` — List chats

### Admin
- `GET /api/admin/stats` — Platform statistics
- `GET /api/admin/verifications` — Pending verifications
- `PUT /api/admin/verifications/:id` — Approve/reject

## 🎨 Design System

- **Primary**: Deep navy `#17105F`
- **Blue**: `#1769E0`
- **Background**: Light lavender `#F5F3FF`
- **Cards**: White with rounded corners and soft shadows
- **Typography**: Inter font, clean and readable
- **Components**: Pill badges, circular progress indicators, smooth transitions

## 📄 License

MIT
