import React from "react";
import { Input } from "../ui/input";
import { CircleCheck, CircleX } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="mx-40">
      <SecurityForm />
      <OAuthLink />
    </div>
  );
}

function SecurityForm() {
  return (
    <form className="w-full text-sm font-medium font-sans mt-4">
      <div className="flex gap-20">
        <div className="mb-4 w-3/4 select-none">
          <label className="block mb-1">Email</label>
          <Input disabled className=" border-2" />
        </div>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Current Password</label>
        <Input type="password" placeholder="Current Password" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Change Password</label>
        <Input type="password" placeholder="New Password" />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm Password</label>
        <Input type="password" placeholder="Confirm New Password" />
      </div>
      <button
        type="submit"
        className="w-full bg-mysecondary text-lg text-background hover:text-foreground font-medium font-navbar py-2 px-4 rounded-md hover:bg-mysecondary-hover"
      >
        Update Password
      </button>
    </form>
  );
}

function OAuthLink() {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Connect OAuth Accounts</h2>
      <div className="flex gap-4 flex-wrap text-background font-medium font-navbar">
        {["Google Account", "GitHub Account"].map((provider, index) => (
          <button
            key={index}
            className="flex-1 bg-mysecondary py-2 px-4 rounded-md hover:text-foreground hover:bg-mysecondary-hover"
          >
            {provider} <CircleCheck className="inline ml-2 text-green-500" />{" "}
            <CircleX className="inline ml-2 text-red-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
