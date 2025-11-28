"use client";
import React, { useState } from "react";
import MainTab from "./MainTab";

type TabType = "General" | "Security" | "Billing" | "Preferences";

function Profile() {
  const [currentTab, setCurrentTab] = useState<TabType>("General");

  const tabs: TabType[] = ["General", "Security", "Billing", "Preferences"];

  return (
    <>
      <div className="flex-1 h-full border-r border-border">
        {tabs.map((item) => (
          <div
            className={`w-full px-4 py-4 font-navbar font-normal text-xl cursor-pointer border-b border-border transition-colors ${
              currentTab === item
                ? "bg-accent text-accent-foreground border-l-4 border-l-primary"
                : "text-foreground hover:text-primary hover:bg-accent/50"
            }`}
            key={item}
            onClick={() => setCurrentTab(item)}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-4 h-full overflow-y-auto">
        <MainTab currentTab={currentTab} />
      </div>
    </>
  );
}

export default Profile;
