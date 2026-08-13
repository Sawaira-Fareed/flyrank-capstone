import Image from "next/image";

const assignments = [
  {
    week: "Week 01",
    title: "Environment and AI Toolchain",
    links: [
      { label: "GitHub Repo", url: "https://github.com/Sawaira-Fareed/FlyRank-Internship-Tasks.git" },
    ],
  },
  {
    week: "Week 02",
    title: "The AI-Assisted Workflow Drill",
    links: [
      { label: "Lazy Branch", url: "https://github.com/Sawaira-Fareed/FlyRank-Internship-Tasks/tree/feature-lazy" },
      { label: "Pro Branch", url: "https://github.com/Sawaira-Fareed/FlyRank-Internship-Tasks/tree/feature-pro" },
      { label: "WORKFLOW.md", url: "https://github.com/Sawaira-Fareed/FlyRank-Internship-Tasks/blob/feature-pro/WorkFlow.md" },
      { label: "CLAUDE.md", url: "https://github.com/Sawaira-Fareed/FlyRank-Internship-Tasks/blob/feature-pro/Claude.md" },
      { label: "Google Doc", url: "https://docs.google.com/document/d/1N7J9VVYUOHXIKQ_DpvocQ0Iwe4TrjfWf1SNfRJnrbcI/edit?usp=sharing" },
    ],
  },
  {
    week: "Week 03",
    title: "React App Development with AI",
    links: [
      { label: "CineDrift GitHub", url: "https://github.com/Sawaira-Fareed/CineDrift.git" },
      { label: "Documentation", url: "https://docs.google.com/document/d/1a1hjFtuJt8jKfvFOWjcavYwOkmh0JPHeVz9rgpKJ_ts/edit?usp=sharing" },
      { label: "Live Demo", url: "https://cinedrift-dusky.vercel.app/" },
    ],
  },
  {
    week: "Week 03",
    title: "Capstone Skeleton, Deployed",
    links: [
      { label: "GitHub Repo", url: "https://github.com/Sawaira-Fareed/flyrank-capstone.git" },
      { label: "Live Demo", url: "https://flyrank-capstone-rosy.vercel.app/" },
    ],
  },
  {
    week: "Week 04",
    title: "Accessible Component Fundamentals",
    links: [
      { label: "GitHub Repo", url: "https://github.com/Sawaira-Fareed/flyrank-capstone" },
      { label: "Live Playground", url: "https://flyrank-capstone-rosy.vercel.app/playground" },
      { label: "NOTES.md", url: "https://github.com/Sawaira-Fareed/flyrank-capstone/blob/main/playground/NOTES.md" },
    ],
  },
  {
    week: "Week 04",
    title: "Streaming AI Chat Interface",
    links: [
      { label: "Live Chat", url: "https://flyrank-capstone-rosy.vercel.app/chat" },
      { label: "Chat Component (GitHub)", url: "https://github.com/Sawaira-Fareed/flyrank-capstone/tree/main/src/app/chat" },
      { label: "Route Handler (GitHub)", url: "https://github.com/Sawaira-Fareed/flyrank-capstone/blob/main/src/app/(app)/api/chat/route.ts" },
    ],
  },
   {
    week: "Week 05",
    title: "Tool Results and Structured Output in the UI (FE-07)",
    links: [
      { label: "Live Demo", url: "https://flyrank-capstone-rosy.vercel.app/" },
      { label: "Tool Components (GitHub)", url: "https://github.com/Sawaira-Fareed/flyrank-capstone/tree/main/src/components/tools" },
      { label: "Route Handler (GitHub)", url: "https://github.com/Sawaira-Fareed/flyrank-capstone/blob/main/src/app/api/chat/route.ts" },
    ],
  },
];

export default function AssignmentsPage() {
  return (
    <div
      className="relative min-h-screen py-20 px-6 overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #87CEEB 0%, #B0E0E6 25%, #FFD6E8 50%, #FDF2F8 75%, #EDE9FE 100%)",
      }}
    >
      {/* Sky blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full bg-white/30 blur-[140px]" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-[#FFD6E8]/30 blur-[130px]" />
      <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#C4B5FD]/20 blur-[120px]" />

      {/* Natural stars */}
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            left: `${Math.random() * 94}%`,
            top: `${Math.random() * 94}%`,
            opacity: 0.3 + Math.random() * 0.5,
            boxShadow: "0 0 4px rgba(255,255,255,0.6)",
          }}
        />
      ))}

      {/* Elsa — centered vertically, right side, in front */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 w-[300px] lg:w-[420px] z-30">
        <Image
          src="/assignments.png"
          alt="Elsa with assignments"
          width={420}
          height={560}
          className="object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-20 lg:mr-[320px]">
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#312E81] text-center mb-4">
          📋 FlyRank Assignments
        </h1>
        <p className="text-center text-[#6B7280] mb-12">
          Frontend AI Engineering Track — All submissions with live demos and source code
        </p>

        <div className="space-y-6">
          {assignments.map((assignment, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/40 px-6 py-5"
              style={{
                background: "rgba(255,255,255,0.30)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: "0 8px 32px rgba(135,206,235,0.15)",
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-gradient-to-r from-[#87CEEB] to-[#F472B6] text-white px-3 py-1 rounded-full">
                  {assignment.week}
                </span>
                <h2 className="font-heading text-xl font-bold text-[#312E81]">
                  {assignment.title}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {assignment.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/50 backdrop-blur px-4 py-2 text-sm font-medium text-[#312E81] hover:bg-white/70 hover:border-[#87CEEB]/60 transition"
                  >
                    {link.url.includes("vercel.app") || link.url.includes("cinedrift") ? "🔗" : "📄"} {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}