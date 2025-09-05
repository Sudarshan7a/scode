"use client";
import Logo from "@/components/Logo";

export default function TopLogo({ className }: { className?: string }) {
  return (
    <div
      className={`absolute top-16 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none ${
        className ?? ""
      }`}
    >
      <div className="relative w-40 group">
        <div className="absolute -inset-2 rounded-3xl blur-xl opacity-30 bg-gradient-to-r from-orange-400 via-blue-400 to-purple-400 group-hover:opacity-40 transition-opacity duration-500 animate-pulse" />

        <div className="absolute -inset-1 rounded-2xl blur-lg opacity-20 bg-gradient-to-r from-mysecondary to-[#3c8de3] group-hover:opacity-30 transition-opacity duration-300" />

        <div className="relative rounded-2xl  border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-sm overflow-hidden transform hover:scale-[1.02] transition-all duration-300 p-2">
          <div className="flex items-center justify-center py-2">
            <Logo forceShow className="h-10 w-auto opacity-95 scale-150" />
          </div>
        </div>
      </div>
    </div>
  );
}
