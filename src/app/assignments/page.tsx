import Link from "next/link";

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
];

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen py-20 px-6"
      style={{ background: "linear-gradient(135deg, #F7F3FF 0%, #FFF8FD 50%, #EEF8FF 100%)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#312E81] text-center mb-4">
          📋 FlyRank Assignments
        </h1>
        <p className="text-center text-[#6B7280] mb-12">
          Frontend AI Engineering Track — All submissions with live demos and source code
        </p>

        <div className="space-y-8">
          {assignments.map((assignment, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/50 bg-white/70 backdrop-blur-lg p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold bg-[#8B5CF6] text-white px-3 py-1 rounded-full">
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C4B5FD]/40 bg-white/60 px-4 py-2 text-sm font-medium text-[#312E81] hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/40 transition"
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