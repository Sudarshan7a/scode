"use client";
import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export default function PrimaryAction({ label, onClick, disabled, className }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 px-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-mysecondary focus:ring-offset-2 relative overflow-hidden group ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } bg-gradient-to-r from-mysecondary to-mysecondary-hover ${className ?? ""}`}
    >
      <span className="relative z-10">{label}</span>
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          disabled ? "pointer-events-none" : ""
        }`}
        style={{
          background: "linear-gradient(135deg, var(--color-mysecondary), var(--color-mysecondary-hover))",
        }}
      />
    </button>
  );
}
