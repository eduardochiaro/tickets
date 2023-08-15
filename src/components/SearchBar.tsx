'use client';

import { useEffect, useState } from "react";
import { Dialog } from '@headlessui/react'

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(true);

  // show bar when command+k is pressed
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
  }
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
  });
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-gray-950/70 backdrop-blur-sm" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 p-32">
        {/* The actual dialog panel  */}
        <Dialog.Panel className="mx-auto w-1/2 rounded bg-white dark:bg-gray-800 p-2 ring-1 ring-gray-100 dark:ring-gray-700">
          searchbox
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}