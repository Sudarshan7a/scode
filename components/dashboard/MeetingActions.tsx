"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardHostButton from "./meetingActions/DashboardHostButton";
import DashboardJoinButton from "./meetingActions/DashboardJoinButton";

/**
 * MeetingActions Component
 *
 * A dashboard-specific component that provides quick access to meeting actions:
 * - Create a new meeting (host)
 * - Join an existing meeting
 *
 * Similar to the navbar host/join buttons but styled for the dashboard layout.
 */
export default function MeetingActions() {
  return (
    <Card className="w-full max-w-3xl mx-auto border-mysecondary shadow-md bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quick Actions
            </h2>
            <p className="text-sm text-muted-foreground">
              Start a new meeting or join an existing one
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {/* New Meeting Button */}
            <DashboardHostButton />

            {/* Join Meeting Button */}
            <DashboardJoinButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
