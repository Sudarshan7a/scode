"use client";
import React, { useState } from "react";
import MainTab from "./MainTab";

type TabType = "General" | "Security" | "Billing" | "Preferences";

function Profile() {
  const [currentTab, setCurrentTab] = useState<TabType>("General");

  const tabs: TabType[] = ["General", "Security", "Billing", "Preferences"];

  return (
    <>
      <div className="flex-1 h-full border-r border-mysecondary">
        {tabs.map((item) => (
          <div
            className={`w-full px-2 py-4 font-navbar font-normal text-xl cursor-pointer border-b-1 border-accent-foreground transition-colors ${
              currentTab === item
                ? "bg-mysecondary/10 text-mysecondary border-l-4 border-l-mysecondary"
                : "text-foreground hover:text-mysecondary hover:bg-mysecondary/5"
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
