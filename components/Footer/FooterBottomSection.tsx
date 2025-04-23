import React from "react";

export default function FooterBottomSection() {
  return (
    <div className="mt-12 border-t border-secondary pt-6 flex justify-between items-center text-sm text-foreground opacity-70">
      <p>© 2025 Scode. All rights reserved.</p>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="bg-secondary hover:bg-secondary-hover text-white p-2 rounded-full shadow-md transition"
        aria-label="Scroll to top"
      >
        {/* Add your ArrowUp icon component here */}
        {/* Example: <ArrowUp size={20} /> */}^
      </button>
    </div>
  );
}
