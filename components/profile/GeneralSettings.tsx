import React from "react";
import AvatarIcon from "../icons/AvatarIcon";
import { Input } from "../ui/input";

export function GeneralSettings() {
  return (
    <div className="flex flex-col items-center px-40">
      <AvatarIcon className="w-40 h-40" />
      <ProfileForm />
    </div>
  );
}

function ProfileForm() {
  return (
    <form className="w-full text-sm font-medium font-sans mt-4">
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Name</label>
          <Input />
        </div>
        <div className="mb-4 flex-1">
          <label className="block mb-1">Pronouns</label>
          <Input placeholder=" He/Him, She/Her" />
        </div>
      </div>
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Current role</label>
          <Input />
        </div>
        <div className="mb-4 flex-1">
          <label className="block mb-1">Date of birth</label>
          <Input placeholder="MM/DD/YYYY" />
        </div>
      </div>
      <div className="flex gap-20">
        <div className="mb-4 flex-1">
          <label className="block mb-1">Email</label>
          <Input />
        </div>
        <div className="mb-4 flex-1"></div>
      </div>
      <button
        type="submit"
        className="w-full bg-mysecondary text-white py-2 px-4 rounded-md hover:bg-mysecondary-hover hover:cursor-pointer"
      >
        Save Changes
      </button>
    </form>
  );
}
