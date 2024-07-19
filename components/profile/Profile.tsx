import React from "react";
import MainTab from "./MainTab";

function Profile() {
  return (
    <>
      <div className="flex-1 h-full">
        {["General", "Security", "Billing", "Preferences"].map((item) => (
          <div
            className="w-full px-2 py-4 font-navbar font-normal text-xl text-foreground border-b-1 border-accent-foreground hover:text-mysecondary"
            key={item}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="flex-4 h-full">
        <MainTab currentTab="General" />
      </div>
    </>
  );
}

export default Profile;
