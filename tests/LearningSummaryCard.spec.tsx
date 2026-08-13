import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LearningSummaryCard from "@/components/tools/LearningSummaryCard";

describe("LearningSummaryCard", () => {
  const mockData = {
    projects: [{ title: "Weather App", progress: 60, status: "active" }],
    totalSkills: 10,
    completedSkills: 4,
    activeSkill: "API Integration",
    streak: 3,
    xp: 250,
    badges: ["First Step 🌱", "Builder 🏗️"],
    recentLessons: ["HTML Basics", "CSS Flexbox"],
  };

  it("shows streak value", () => {
    render(<LearningSummaryCard data={mockData} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows XP value", () => {
    render(<LearningSummaryCard data={mockData} />);
    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("shows project title with progress", () => {
    render(<LearningSummaryCard data={mockData} />);
    expect(screen.getByText("Weather App")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("shows active skill name", () => {
    render(<LearningSummaryCard data={mockData} />);
    expect(screen.getByText("API Integration")).toBeInTheDocument();
  });

  it("shows badge names", () => {
    render(<LearningSummaryCard data={mockData} />);
    expect(screen.getByText("First Step 🌱")).toBeInTheDocument();
    expect(screen.getByText("Builder 🏗️")).toBeInTheDocument();
  });
});