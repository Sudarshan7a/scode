import React from "react";
import { ArrowUp } from "lucide-react";

export default function FooterBottomSection() {
  const handleScrollTop = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-6   border-t border-mysecondary pt-2 flex justify-between items-center text-sm text-myforeground opacity-70">
      <p>© 2025 Scode. All rights reserved.</p>
      <button
        onClick={handleScrollTop}
        className="bg-mysecondary hover:bg-mysecondary-hover text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 cursor-pointer"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
