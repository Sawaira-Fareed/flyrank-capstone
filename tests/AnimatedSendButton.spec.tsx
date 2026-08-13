import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AnimatedSendButton from "@/components/common/AnimatedSendButton";


describe("AnimatedSendButton", () => {
  it("renders with send icon initially", () => {
    render(<AnimatedSendButton onSend={async () => true} />);
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("shows retry text after failed send", async () => {
    const onSend = vi.fn().mockResolvedValue(false);
    render(<AnimatedSendButton onSend={onSend} />);
    
    fireEvent.click(screen.getByRole("button"));
    
    await waitFor(() => {
      expect(screen.getByText("Retry")).toBeInTheDocument();
    });
  });

  it("calls onSend when clicked", async () => {
    const onSend = vi.fn().mockResolvedValue(true);
    render(<AnimatedSendButton onSend={onSend} />);
    
    fireEvent.click(screen.getByRole("button"));
    
    await waitFor(() => {
      expect(onSend).toHaveBeenCalled();
    });
  });

  it("does not call onSend when disabled", () => {
    const onSend = vi.fn();
    render(<AnimatedSendButton onSend={onSend} disabled={true} />);
    
    fireEvent.click(screen.getByRole("button"));
    
    expect(onSend).not.toHaveBeenCalled();
  });
});