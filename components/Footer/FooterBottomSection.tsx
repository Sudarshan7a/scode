import React from "react";

export default function FooterBottomSection() {
  const handleScrollTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-12 border-t border-mysecondary pt-6 flex justify-between items-center text-sm text-myforeground opacity-70">
      <p>© 2025 Scode. All rights reserved.</p>
      <button
        onClick={handleScrollTop}
        className="bg-mysecondary hover:bg-mysecondary-hover text-white p-2 rounded-full shadow-md transition cursor-pointer"
        aria-label="Scroll to top"
      >
        {/* Add your ArrowUp icon component here */}
        {/* Example: <ArrowUp size={20} /> */}^
      </button>
    </div>
  );
}
