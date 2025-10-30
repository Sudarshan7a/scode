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
    <div className="font-navbar text-xl font-normal h-[6vh] flex border-t-1 border-t-myforeground bg-mybackground">
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={`flex-1 flex items-center justify-center my-auto h-9/12 text-center cursor-pointer transition-colors ${
            index < tabs.length - 1 ? "border-r-1 border-r-myforeground" : ""
          } ${
            activeTab === tab.id
              ? "bg-mysecondary text-white"
              : "hover:bg-mysecondary-hover text-myforeground"
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
