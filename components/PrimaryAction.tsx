"use client";
import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

export default function PrimaryAction({
  label,
  onClick,
  disabled,
  loading,
  className,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full cursor-pointer py-3 px-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-[1.02] focus:ring-1 focus:ring-mysecondary focus:ring-offset-2 relative overflow-hidden group ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      } bg-gradient-to-r from-mysecondary to-mysecondary-hover ${
        className ?? ""
      }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <svg
            className="animate-spin h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {loading ? "Loading..." : label}
      </span>
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
          isDisabled ? "pointer-events-none" : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, var(--color-mysecondary), var(--color-mysecondary-hover))",
        }}
      />
    </button>
  );
}
