"use client";
import React from "react";
import { GeneralSettings } from "./GeneralSettings";
import { SecuritySettings } from "./SecuritySettings";
import { BillingSettings } from "./BillingSettings";
import { PreferencesSettings } from "./PreferencesSettings";

interface MainTabProps {
  currentTab: "General" | "Security" | "Billing" | "Preferences";
}

function MainTab({ currentTab }: MainTabProps) {
  switch (currentTab) {
    case "General":
      return (
        <div className="p-4">
          <GeneralSettings />
        </div>
      );
    case "Security":
      return (
        <div className="p-4">
          <SecuritySettings />
        </div>
      );
    case "Billing":
      return (
        <div className="p-4">
          <BillingSettings />
        </div>
      );
    case "Preferences":
      return (
        <div className="p-4">
          <PreferencesSettings />
        </div>
      );
    default:
      return <div className="p-4">Select a tab to view content</div>;
  }
}

export default MainTab;
