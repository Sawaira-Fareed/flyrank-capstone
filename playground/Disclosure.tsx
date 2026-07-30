"use client";

import { useState, type ReactNode } from "react";

interface DisclosureProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export default function Disclosure({ title, children, defaultOpen = false }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg">
<button
  id="disclosure-button"
  aria-expanded={isOpen}
  aria-controls="disclosure-panel"
  onClick={() => setIsOpen(!isOpen)}
  className="w-full flex items-center justify-between px-4 py-3 text-left font-medium hover:bg-gray-50 rounded-lg"
>
        <span>{title}</span>
                <span className="text-lg transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          ▼
        </span>
      </button>
      <div
        id="disclosure-panel"
        role="region"
        aria-labelledby="disclosure-button"
        hidden={!isOpen}
        className="px-4 pb-4"
      >
        {children}
      </div>
    </div>
  );
}