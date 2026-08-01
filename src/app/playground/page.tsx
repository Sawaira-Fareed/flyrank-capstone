"use client";

import { useState } from "react";
import Modal from "@/../playground/Modal";
import Tabs from "@/../playground/Tabs";
import Disclosure from "@/../playground/Disclosure";

export default function PlaygroundPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sampleTabs = [
    { id: "1", label: "Tab One", content: <p>This is the first tab content.</p> },
    { id: "2", label: "Tab Two", content: <p>Second tab — arrow keys should work.</p> },
    { id: "3", label: "Tab Three", content: <p>Third tab. Try Home and End keys!</p> },
  ];

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold">Accessible Components Playground</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Modal Dialog</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal
        </button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Example Modal">
          <p>This modal traps focus. Tab around — you cannot leave the modal.</p>
          <p className="mt-2">Press Escape or click the backdrop to close.</p>
        </Modal>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Tabs</h2>
        <Tabs tabs={sampleTabs} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Disclosure</h2>
        <Disclosure title="Click to expand">
          <p>This content is hidden by default. The button uses aria-expanded.</p>
        </Disclosure>
        <div className="mt-2">
          <Disclosure title="Another disclosure" defaultOpen>
            <p>This one starts open because defaultOpen is true.</p>
          </Disclosure>
        </div>
      </section>
    </main>
  );
}