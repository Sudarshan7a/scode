"use client";
import React, { useState } from "react";
import MainTab from "./MainTab";

type TabType = "General" | "Security" | "Billing" | "Preferences";

function Profile() {
  const [currentTab, setCurrentTab] = useState<TabType>("General");

  const tabs: TabType[] = ["General", "Security", "Billing", "Preferences"];

  return (
    <>
      <div className="flex-1 h-full border-r border-mysecondary/15 bg-mybackground">
        <div className="p-3">
          {tabs.map((item) => (
            <div
              className={`w-full px-4 py-3 mb-1 font-navbar font-medium text-base cursor-pointer rounded-xl transition-all duration-200 ${
                currentTab === item
                  ? "bg-mysecondary text-white shadow-md shadow-mysecondary/25"
                  : "text-myforeground hover:bg-mysecondary/10"
              }`}
              key={item}
              onClick={() => setCurrentTab(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-4 h-full overflow-y-auto bg-mybackground">
        <MainTab currentTab={currentTab} />
      </div>
    </>
  );
}

export default Profile;
