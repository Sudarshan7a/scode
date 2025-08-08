import React, { useState } from "react";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { Button } from "../ui/button";

export function PreferencesSettings() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <div className="flex flex-col mx-20 my-8">
      <h2 className="font-semibold font-sans text-foreground text-2xl mb-4">
        Preferences Settings
      </h2>

      {/* Notifications */}
      <div
        id="notification"
        className="mb-8 font-sans text-foreground text-xl mx-40 flex justify-between items-center gap-2"
      >
        <h3>Notifications</h3>
        <Switch
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
        />
      </div>

      {/* Theme */}
      <div className="mb-8 font-sans text-foreground text-xl mx-40 flex justify-between items-center gap-2">
        <h3>Theme</h3>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue
              placeholder="Select theme"
              className="placeholder:text-foreground"
            />
          </SelectTrigger>
          <SelectContent className="border-foreground">
            <SelectGroup>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Language */}
      <div className="mb-8 font-sans text-foreground text-xl mx-40 flex justify-between items-center gap-2">
        <h3>Language</h3>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <Image
                  src="/svg/question_mark.svg"
                  alt="Question mark"
                  className="w-6 h-6 mt-1"
                  width={8}
                  height={8}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold font-sans">
                More languages are coming soon
              </p>
            </TooltipContent>
          </Tooltip>

          <Select disabled>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="English"
                className="placeholder:text-foreground"
              />
            </SelectTrigger>
            <SelectContent className="border-foreground">
              <SelectGroup>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
