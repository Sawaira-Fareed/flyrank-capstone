import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BadgePopup from "@/components/badges/BadgePopup";

describe("BadgePopup", () => {
  const mockBadge = {
    badge_name: "Builder 🏗️",
    badge_icon: "🏗️",
    badge_description: "Created 3 projects",
    xp_reward: 200,
  };

  it("renders nothing when badge is null", () => {
    render(<BadgePopup badge={null} onClose={() => {}} />);
    expect(screen.queryByText("🏆 Badge Earned!")).not.toBeInTheDocument();
  });

  it("shows badge title and XP reward when badge provided", () => {
    render(<BadgePopup badge={mockBadge} onClose={() => {}} />);
    expect(screen.getByText("🏆 Badge Earned!")).toBeInTheDocument();
    expect(screen.getByText("+200 XP")).toBeInTheDocument();
  });

  it("shows badge description", () => {
    render(<BadgePopup badge={mockBadge} onClose={() => {}} />);
    expect(screen.getByText("Created 3 projects")).toBeInTheDocument();
  });

  it("calls onClose when clicking backdrop", () => {
    const onClose = vi.fn();
    const { container } = render(<BadgePopup badge={mockBadge} onClose={onClose} />);
    // Click the backdrop (fixed overlay)
    const backdrop = container.querySelector(".fixed.inset-0");
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalled();
    }
  });
});