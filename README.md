# 🌸 BloomLab

> **Learning grows naturally.**

**BloomLab** is an AI-powered, project-based learning platform designed to help developers learn by building real projects.

Instead of following a fixed curriculum, learners describe what they want to build. **Elsa**, their AI learning mentor, analyzes the project, identifies the required skills, creates a personalized learning path, and guides the learner through focused 15-minute lessons.

The goal is simple: **turn learning into something you build, not something you merely consume.**

---

## 🚀 Live Demo

**Production:** https://flyrank-capstone-rosy.vercel.app

---

## ✨ Features

### 🌱 Project-First Learning

* Describe a project you want to build.
* Elsa identifies the skills required to complete it.
* A personalized skill map is generated automatically.
* Skills progress through `Locked → Active → Completed`.
* Every lesson contributes toward project completion.

### 🤖 Elsa — AI Learning Mentor

Elsa provides context-aware assistance throughout the learning journey.

* Project-specific guidance
* Skill and lesson assistance
* Learning-progress summaries
* Feature suggestions
* Continuation prompts
* Tool calling for real application data
* Multi-provider AI fallback

**AI provider chain:**

```text
OpenRouter → Groq → Gemini
```

### 📚 15-Minute Lessons

Lessons are designed around short, focused learning sessions.

The platform tracks:

* Lessons completed
* Lesson scores
* Skill completion
* Project progress
* XP
* Daily goals
* Learning streaks

### 💬 Persistent Learning Chat

Learning conversations are persisted per skill, allowing learners to:

* Continue previous conversations
* Review earlier explanations
* Ask follow-up questions
* Resume learning without losing context

### 🏅 Certificates

When a project is completed, learners can create a certificate from an AI-generated suggestion.

Supported actions:

* Generate certificate suggestions
* Edit certificate content
* Upload screenshots
* Generate downloadable PNG certificates
* Archive certificates
* View, edit, or delete certificates

### 🔖 Resources & Bookmarks

Learners can save useful resources while studying.

Resources are:

* Linked to the current project
* Stored persistently
* Editable and removable
* Displayed within the Archive

### 📊 Dashboard

The dashboard provides a centralized view of learning activity.

Includes:

* Current streak
* Lessons completed
* Projects
* XP
* Monthly activity calendar
* Earned badges
* Elsa's personalized notes

Calendar states include:

* 🟣 Active day
* 🔴 Missed day
* 🩷 Current day

### 🎮 Gamification

| System        | Behavior                                                  |
| ------------- | --------------------------------------------------------- |
| XP            | +50 per lesson, +200 per completed project, badge rewards |
| Streaks       | Automatically tracked and reset after a missed day        |
| Badges        | 14 achievement badges                                     |
| Badge Popup   | Sparkle and flip animation with optional sound            |
| Notifications | Triggered by relevant learning achievements               |

### 🌸 Gamified 404

BloomLab includes a themed 404 experience with a small interactive quest.

Implementation:

```text
src/app/not-found.tsx
```

---

# 🏗️ Architecture

BloomLab uses a Next.js App Router architecture with Supabase as the persistence layer and an AI orchestration layer for Elsa.

```text
┌─────────────────────┐
│       Learner       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    Next.js App      │
│  App Router + UI    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      useChat()      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     /api/chat       │
│                     │
│  Intent Detection   │
│  Tool Execution     │
│  AI Provider Chain  │
└──────────┬──────────┘
           │
      ┌────┴─────┐
      │          │
      ▼          ▼
┌──────────┐  ┌──────────────┐
│ Supabase │  │ AI Providers │
│          │  │              │
│ Postgres │  │ OpenRouter   │
│ Storage  │  │ Groq         │
│ Auth     │  │ Gemini       │
└──────────┘  └──────────────┘
```

### Core Data Flow

```text
Create Project
      ↓
AI analyzes project
      ↓
Skills generated
      ↓
Skill Map stored in Supabase
      ↓
Learner selects a skill
      ↓
Chat with Elsa
      ↓
Lesson completed
      ↓
XP + streak + progress updated
      ↓
Badge / notification checks
      ↓
Project completed
      ↓
Certificate becomes available
```

---

# 🧠 AI Architecture

Elsa uses a provider fallback strategy to improve reliability while keeping infrastructure costs low.

```text
                    ┌──────────────┐
                    │ Elsa Request │
                    └──────┬───────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    OpenRouter   │
                  └────────┬────────┘
                           │
                    unavailable?
                           │
                           ▼
                  ┌─────────────────┐
                  │      Groq       │
                  └────────┬────────┘
                           │
                    unavailable?
                           │
                           ▼
                  ┌─────────────────┐
                  │     Gemini      │
                  └─────────────────┘
```

This allows the application to continue operating when a primary provider is unavailable or reaches its usage limits.

---

# 🔧 AI Tooling

## `getLearningContext`

Elsa can retrieve the learner's real learning data from Supabase when the conversation requires it.

Example prompts:

```text
"Show my learning summary."

"What's my progress?"

"Show me my stats."
```

### Input

```typescript
{
  userId: string;
}
```

If `userId` is empty, the authenticated user is used.

### Output

```typescript
{
  projects: {
    title: string;
    progress: number;
    status: string;
  }[];

  totalSkills: number;
  completedSkills: number;
  activeSkill: string | null;

  streak: number;
  xp: number;

  badges: string[];
  recentLessons: string[];
}
```

### Tool States

| State              | UI                                   |
| ------------------ | ------------------------------------ |
| `input-streaming`  | 🔧 Elsa is deciding how to help...   |
| `input-available`  | 🔧 Fetching your learning summary... |
| `output-available` | 📊 Learning Summary Card             |
| `output-error`     | ❌ Error with retry option            |

### Implementation

```text
src/app/api/chat/route.ts
src/components/tools/LearningSummaryCard.tsx
src/components/tools/ToolPartRenderer.tsx
```

---

# 🛠️ Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| Framework          | Next.js 16                     |
| Routing            | App Router                     |
| Bundler            | Turbopack                      |
| Language           | TypeScript                     |
| Styling            | Tailwind CSS                   |
| Animation          | Framer Motion                  |
| Authentication     | Supabase Auth                  |
| Database           | Supabase PostgreSQL            |
| Storage            | Supabase Storage               |
| Primary AI         | OpenRouter                     |
| Primary Model      | GPT-4o Mini                    |
| AI Fallback        | Groq                           |
| Fallback Model     | Qwen3.6 27B                    |
| Secondary Fallback | Gemini 2.0 Flash               |
| AI SDK             | Vercel AI SDK                  |
| Icons              | Lucide React                   |
| Markdown           | react-markdown                 |
| Testing            | Vitest + React Testing Library |
| E2E Testing        | Playwright                     |
| Deployment         | Vercel                         |

---

# 🛡️ Security & Reliability

## Rate Limiting

The `/api/chat` endpoint is protected by per-user rate limiting.

```text
Limit: 20 requests / minute / user
```

When the limit is exceeded, the API returns:

```http
429 Too Many Requests
```

with a rate-limit error message.

### Current Implementation

Rate limiting is currently implemented in memory.

This is appropriate for the current demo/internship deployment, but it is **not suitable for horizontally scaled production infrastructure** because each server instance maintains its own rate-limit state.

### Production Improvement

A distributed store such as Redis should be used for production-scale rate limiting.

---

# 🧪 Testing

BloomLab uses unit/component testing and browser-based end-to-end testing.

## Component Tests

**13 tests passing**

```bash
npm run test
```

Testing stack:

* Vitest
* React Testing Library

## End-to-End Tests

**3 tests passing**

Start the development server:

```bash
npm run dev
```

Then, in another terminal:

```bash
npm run test:e2e
```

Testing stack:

* Playwright

## Continuous Integration

GitHub Actions runs the component test suite on every push to `main`.

Workflow:

```text
.github/workflows/test.yml
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure the following are installed/configured:

* Node.js 18+
* npm
* Supabase project
* OpenRouter API key
* Groq API key
* Gemini API key

## Installation

Clone the repository and install dependencies:

```bash
npm install --legacy-peer-deps
```

Start the development server:

```bash
npm run dev
```

The application will be available through the local Next.js development server.

---

# 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=...
GROQ_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

> Never commit `.env.local` or expose server-side API keys in client-side code.

---

# 📜 Available Scripts

| Command            | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Create production build  |
| `npm run start`    | Start production server  |
| `npm run test`     | Run component tests      |
| `npm run test:e2e` | Run Playwright E2E tests |

---

# 🎨 Design System

BloomLab uses a soft, garden-inspired visual language built around glassmorphism and rounded surfaces.

| Element       | Value                |
| ------------- | -------------------- |
| Primary       | `#8B5CF6` Violet     |
| Secondary     | `#F472B6` Pink       |
| Accent        | `#87CEEB` Sky Blue   |
| Background    | Sky Blossom gradient |
| Cards         | Glassmorphism        |
| Heading Font  | Space Grotesk        |
| Body Font     | Manrope              |
| Border Radius | 24–28px              |

The visual system is intended to make the platform feel approachable while maintaining a modern developer-product aesthetic.

---

# 🤖 Development with AI

AI was used throughout development as an engineering assistant rather than as a replacement for implementation and verification.

| Area               | AI Contribution                  | Engineering Work                      |
| ------------------ | -------------------------------- | ------------------------------------- |
| Elsa system prompt | Initial prompt drafting          | Personality, behavior, and refinement |
| Skill generation   | JSON/schema suggestions          | Validation and implementation         |
| AI tools           | Tool structure suggestions       | Zod schema and execution logic        |
| Badge animations   | Framer Motion implementation     | Timing and UX refinement              |
| Certificates       | Canvas implementation assistance | Layout and CORS debugging             |
| Testing            | Test-case suggestions            | Implementation and verification       |

### Engineering Principles

Key implementation decisions were based on:

* Reliability
* Simplicity
* Maintainability
* Low infrastructure cost
* Clear separation between UI, AI, and persistence
* Real application data instead of simulated responses

---

# 📌 Engineering Decisions

| Decision                       | Rationale                                                                 |
| ------------------------------ | ------------------------------------------------------------------------- |
| Next.js App Router             | Full-stack React architecture with server-side capabilities               |
| Supabase                       | PostgreSQL, authentication, storage, and database tooling in one platform |
| Multi-provider AI              | Improves resilience against provider limits and outages                   |
| Vercel AI SDK                  | Simplifies streaming and AI tool integration                              |
| 15-minute lessons              | Keeps learning sessions focused and measurable                            |
| Persistent skill conversations | Allows learners to continue learning without losing context               |
| Tool calling                   | Enables Elsa to work with real learner data                               |
| Glassmorphism                  | Supports the garden-inspired product identity                             |

---

# ⚠️ Known Limitations

| Limitation              | Impact                                                            |
| ----------------------- | ----------------------------------------------------------------- |
| In-memory rate limiting | State resets on server restart and is not shared across instances |
| PNG-only certificates   | No PDF export currently available                                 |
| Badge sound             | May be blocked by browser autoplay policies                       |
| Streaming cancellation  | Stopped responses cannot currently be resumed                     |
| AI provider dependency  | Application behavior depends on external AI APIs                  |

---

# 🔮 Roadmap

* [ ] Distributed Redis-based rate limiting
* [ ] PDF certificate export
* [ ] Social certificate sharing
* [ ] Mobile push notifications
* [ ] Offline learning support
* [ ] Improved streaming resume support
* [ ] More learning analytics
* [ ] Expanded badge and achievement system

---

# 📁 Project Structure

A simplified view of the application structure:

```text
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   ├── not-found.tsx
│   └── ...
│
├── components/
│   ├── tools/
│   │   ├── LearningSummaryCard.tsx
│   │   └── ToolPartRenderer.tsx
│   └── ...
│
└── ...
```

---

# 📄 License

This project was developed as a personal project for the **FlyRank Frontend AI Engineering Internship**.

---

## 🌸 BloomLab

> **Build projects. Learn skills. Grow naturally.**
