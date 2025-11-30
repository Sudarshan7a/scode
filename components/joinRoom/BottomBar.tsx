import React from "react";

export type TabType = "notes" | "call" | "ai";

interface BottomBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

function BottomBar({ activeTab, onTabChange }: BottomBarProps) {
  const tabs = [
    { id: "notes" as TabType, label: "Notes" },
    { id: "call" as TabType, label: "Call" },
    { id: "ai" as TabType, label: "Gemini" },
  ];

  return (
    <div className="font-navbar text-base font-medium h-14 flex items-center gap-2 px-3 border-t border-mysecondary/20 bg-mybackground">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex-1 flex items-center justify-center py-2 rounded-xl cursor-pointer transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-mysecondary text-white shadow-md shadow-mysecondary/25"
              : "text-myforeground hover:bg-mysecondary/10"
          }`}
          onClick={() => onTabChange(tab.id)}
        >
          <p>{tab.label}</p>
        </div>
      ))}
    </div>
  );
}

export default BottomBar;
