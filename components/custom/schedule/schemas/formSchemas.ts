import { z } from "zod";

const baseFormSchema = z.object({
  roomName: z.string().min(3, "Room name is required").trim(),
  description: z.string().trim().optional(),
  roomType: z.enum(["interview", "mock", "pairing"], {
    required_error: "Room type is required",
  }),
  privacyLevel: z.enum(["public", "private"], {
    required_error: "Privacy level is required",
  }),
  editorEnabled: z.boolean(),
  languagePreference: z.string().optional(),
});

export const scheduleFormSchema = baseFormSchema.extend({
  date: z.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Please select today or a future date"),
  time: z.string().refine((time) => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    return time >= currentTime;
  }, "Please select current time or later"),
  duration: z.string().min(1, "Duration is required"),
});

export const hostFormSchema = baseFormSchema;

export const joinFormSchema = z.object({
  roomName: z.string().min(3, "Room link or ID is required").trim(),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
export type HostFormValues = z.infer<typeof hostFormSchema>;
export type JoinFormValues = z.infer<typeof joinFormSchema>;
