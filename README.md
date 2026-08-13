
# 🌸 BloomLab — AI-Powered Project-Based Learning Platform

**Tagline:** *Learning grows naturally.*

BloomLab is an AI-powered coding learning platform where learners learn by **building real projects**, guided by **Elsa**, their personal AI mentor.

Instead of passive theory, learners choose something they want to build, Elsa identifies the skills required, creates a personalized learning path, and guides the learner through focused 15-minute lessons until the project becomes portfolio-ready.

## 🚀 Live Demo

**Production:** https://flyrank-capstone-rosy.vercel.app

---
# FlyRank Capstone

Frontend AI Engineering Capstone project.

## Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Getting Started
```bash
npm install
npm run dev
 Yes. I’ll keep it **concise and README-focused**, with the **FE-07 assignment fully included** and without unnecessary project-structure/detail bloat.
```
## ✨ Features

### 🌱 Project-First Learning

- Describe the project you want to build.
- Elsa generates the required skills.
- Skills are organized into a personalized Skill Map.
- Learners progress through Active, Completed, and Locked skills.
- Every lesson contributes toward the final project.

### 🤖 Elsa — AI Learning Mentor

Elsa provides:

- Project-specific guidance
- Lesson assistance
- Continuation prompts
- Feature suggestions
- Skill-map generation
- Learning-progress summaries
- Context-aware responses

AI providers use fallback support:

```text
OpenRouter → Groq → Gemini
````

### 📚 15-Minute Lessons

Learning is divided into focused lessons designed around the learner's daily goal.

Progress is tracked through:

* Completed lessons
* Lesson scores
* Skill completion
* Project progress
* XP
* Daily streaks

### 🗺️ Skill Map

Each project receives a visual learning path:

```text
Locked → Active → Completed
```

### 💬 Persistent Learning Chat

Conversations are saved per skill so learners can return later and continue their learning.

---

# 🎮 Gamification

BloomLab turns learning progress into a lightweight progression system.

## ⭐ XP

* **+50 XP** — lesson completion
* **+200 XP** — project completion
* Additional XP — badge rewards

## 🔥 Streaks

Daily activity contributes to the learner's streak.

Missing activity resets the streak according to the application's streak logic.

## 🏆 Badges

| Badge               | Requirement                 |
| ------------------- | --------------------------- |
| 🌱 First Step       | Complete 1 lesson           |
| 🌿 Code Gardener    | Complete 5 lessons          |
| 📚 Knowledge Seeker | Complete 10 lessons         |
| 🦉 Scholar Owl      | Complete 25 lessons         |
| ⭐ Perfect Score     | Score 90%+ on a lesson      |
| 🎯 Precision Master | Get 5 perfect scores        |
| 🚀 Project Starter  | Create your first project   |
| 🏗️ Builder         | Create 3 projects           |
| 🏆 Project Master   | Create 5 projects           |
| 🚢 Ship It!         | Complete your first project |
| 🔥 Triple Threat    | Complete 3 projects         |
| 🌟 Consistent       | Reach a 3-day streak        |
| 🔥 Weekly Warrior   | Reach a 7-day streak        |
| 👑 Monthly Master   | Reach a 30-day streak       |

Badge celebrations include custom artwork, animations, sparkles, and sound.

---

# 🌳 Projects

Projects are the center of the BloomLab learning experience.

Learners can:

* Create projects from the Garden or Projects page.
* Generate skills automatically with AI.
* Filter projects by **All / Active / Saved / Done**.
* Save unfinished projects for later.
* Track project progress.
* View project-specific skills and resources.
* Complete projects and receive XP.

---

# 🏅 Certificates

Completed projects can receive a generated certificate.

Features include:

* AI-generated certificate suggestions
* Editable project description and features
* Project screenshot upload
* Canvas-generated PNG certificate
* View certificates
* Edit certificates
* Delete certificates

---

# 🔖 Resources & Bookmarks

Learners can save useful learning resources directly from the Learn experience.

Resources support:

* Save
* Edit
* Delete
* Project association
* Resource type
* URL
* Description

Saved resources are also available from project details and the Archive.

---

# 📊 Dashboard

The Dashboard provides a centralized view of learning activity.

It includes:

* Current streak
* Completed lessons
* Projects
* XP
* Monthly activity calendar
* Badges
* Learning progress
* Elsa's learning notes

The calendar distinguishes active, missed, and current days.

---

# 🔧 FE-07 — `getLearningContext`

FE-07 is BloomLab's **AI learning-context tool**.

It allows Elsa to retrieve the authenticated learner's real learning data from Supabase when the learner explicitly asks about their progress.

## Example Requests

```text
Show my learning summary
What's my progress?
My stats
```

## Input

```typescript
{
  userId: string;
}
```

The `userId` represents the learner's Supabase UUID.

If it is empty, the authenticated Supabase user is used.

## Return Data

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

## Tool States

| State              | UI                                   |
| ------------------ | ------------------------------------ |
| `input-streaming`  | 🔧 Elsa is deciding how to help...   |
| `input-available`  | 🔧 Fetching your learning summary... |
| `output-available` | 📊 Learning Summary Card             |
| `output-error`     | ❌ Error + Retry                      |

## FE-07 Implementation

The main FE-07 files are:

```text
src/app/api/chat/route.ts
src/components/tools/LearningSummaryCard.tsx
src/components/tools/ToolPartRenderer.tsx
```
# 🧪 Testing

## FE-07 Test

1. Open the **Learn** page.
2. Ask Elsa:

```text
Show my learning summary
```

3. Elsa calls `getLearningContext`.
4. The **Learning Summary Card** displays the learner's real data.

The displayed information should correspond to the authenticated learner's data from Supabase.

## AI Error State

```text
1. Open browser DevTools
2. Go to Network
3. Enable Offline
4. Ask Elsa a question
5. Verify the connection error and Retry action
```

---



### Automatic Progression


Lesson Complete
    ↓
+50 XP
Streak update
Notification
Badge check

Badge Earned
    ↓
XP reward
Notification
Streak update

Project Created
    ↓
Notification
Badge check
Streak update

Project Completed
    ↓
+200 XP
Notification
Badge check

---

# 🛠️ Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 16 — App Router + Turbopack |
| Language       | TypeScript                          |
| Styling        | Tailwind CSS + Framer Motion        |
| Authentication | Supabase Auth                       |
| Database       | Supabase PostgreSQL                 |
| Storage        | Supabase Storage                    |
| Primary AI     | OpenRouter → GPT-4o Mini            |
| AI Fallback    | Groq → Llama 3.3 70B                |
| AI Last Resort | Gemini 2.0 Flash                    |
| AI SDK         | Vercel AI SDK                       |
| Icons          | Lucide React                        |
| Markdown       | react-markdown                      |
| Deployment     | Vercel                              |

---

# 🌸 404 Experience

BloomLab includes a themed 404 gamified experience instead of a plain error screen.

Implementation:

```text
src/app/not-found.tsx
```

---

# 🎨 Design System

| Element    | Value                |
| ---------- | -------------------- |
| Primary    | `#8B5CF6` Violet     |
| Secondary  | `#F472B6` Pink       |
| Accent     | `#87CEEB` Sky Blue   |
| Background | Sky Blossom gradient |
| Cards      | Glassmorphism        |
| Headings   | Space Grotesk        |
| Body       | Manrope              |
| Corners    | 24–28px              |
| Shadows    | Soft purple-tinted   |

---

# 👩‍💻 Elsa

Elsa is BloomLab's AI mentor.

Her personality is designed around a warm, garden-themed learning experience. She is encouraging, concise, and focused on helping learners complete their projects.


---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* Supabase account
* OpenRouter API key
* Groq API key
* Gemini API key


---

# 📜 License

Personal Project.

---

