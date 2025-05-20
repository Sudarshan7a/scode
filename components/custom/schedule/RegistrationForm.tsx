"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import MyDatePicker from "@/components/custom/MyDatePicker";
import styles from "./MyScheduleModal.module.css";

const formSchema = z.object({
  roomName: z.string().min(3, "Room name is required").trim(),
  description: z.string().trim().optional(),
  date: z.date().refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, "Please select today or a future date"),
  // time: z.string().min(3, "Time is required"),
  duration: z.string().min(1, "Duration is required"), // Ensure duration is required
  roomType: z.enum(["interview", "mock", "pairing"], {
    required_error: "Room type is required",
  }),
  privacyLevel: z.enum(["public", "private"], {
    required_error: "Privacy level is required",
  }),
  editorEnabled: z.boolean(),
  languagePreference: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type RegistrationFormProps = {
  formType: "schedule" | "host" | "join";
};

export default function RegistrationForm({ formType }: RegistrationFormProps) {
  const isJoinForm = formType === "join";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // Still using FormValues as the base type for the form state
    resolver: isJoinForm ? undefined : zodResolver(formSchema), // Conditionally apply the Zod resolver
    defaultValues: isJoinForm
      ? { roomName: "" } // For 'join' form, only provide default for roomName
      : {
          // For 'schedule' or 'host' forms, provide all default values
          roomName: "",
          description: "",
          date: new Date(),
          duration: "30",
          roomType: "interview",
          privacyLevel: "public",
          editorEnabled: false,
          languagePreference: "",
        },
  });

  const selectedDate = watch("date");

  const onSubmit = (data: Partial<FormValues>) => {
    // Type data as Partial<FormValues>
    if (isJoinForm) {
      // For 'join' form, formSchema validation was skipped.
      // The 'roomName' input has its own inline validation via register options.

      const joinData = {
        roomName: data.roomName,
        joinTimestamp: new Date().toISOString(),
        userId: null, // Placeholder for User ID / Auth Token, replace with real value from storage later
        // IP Address/Region: Typically requires server-side lookup.
        // Placeholder for now, or you might integrate a service if needed.
        ipAddressRegion: null, // Or a placeholder string e.g., "N/A (Client-side)"
        deviceBrowserInfo: navigator.userAgent,
      };
      console.log("Join form submitted with details:", joinData);
      // Implement your join logic using joinData
    } else {
      // For 'schedule' or 'host' forms, formSchema validation was applied.
      // data here is expected to conform to FormValues.
      const enrichedData = {
        ...(data as FormValues), // Safe to cast as FormValues after Zod validation
        userId: null, // Placeholder for User ID / Auth Token, replace with real value from storage later
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browserTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
      };
      console.log("Submitted:", enrichedData);
      // Submit to API here
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-0">
          {formType === "schedule"
            ? "Schedule"
            : formType === "host"
            ? "Host"
            : "Join"}{" "}
        </Button>
      </DialogTrigger>
      {formType !== "join" ? (
        <DialogContent
          className={`min-w-[60%] max-h-[90vh]  overflow-y-auto ${styles.noScrollbar}`}
        >
          <DialogHeader>
            <DialogTitle className="text-title-last font-semibold">
              {formType === "schedule" ? "Schedule" : "Host"} a Session
            </DialogTitle>
            <DialogDescription>
              {formType === "schedule"
                ? "Fill in the details below to schedule a new session."
                : "Fill in the details below to host a session immediately."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <RoomNameInput register={register} errors={errors} />
            <DescriptionInput register={register} />
            <ScheduleFields
              formType={formType}
              selectedDate={selectedDate}
              setValue={setValue}
              errors={errors}
            />
            <RoomTypeSelect setValue={setValue} errors={errors} />
            <PrivacyLevelSelect setValue={setValue} errors={errors} />
            <EditorEnabledCheckbox register={register} />
            <Button type="submit">Confirm Schedule</Button>
          </form>
        </DialogContent>
      ) : (
        <DialogContent
          className={`min-w-[40%] max-h-[70vh] overflow-y-auto ${styles.noScrollbar}`}
        >
          <DialogHeader>
            <DialogTitle className="text-title-last">
              Join a Session
            </DialogTitle>
            <DialogDescription>
              Enter the room link or ID to join an existing session.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="joinRoomId">Room Link or ID</Label>
              <Input
                id="joinRoomId"
                placeholder="Paste room link or enter room ID"
                {...register("roomName", {
                  required: "Room link or ID is required",
                  minLength: {
                    value: 3,
                    message: "Enter at least 3 characters",
                  },
                })}
                className="mt-2"
              />
              {errors.roomName && (
                <p className="text-red-500 text-sm">
                  {errors.roomName.message}
                </p>
              )}
            </div>
            <Button type="submit">Join Room</Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

interface RoomNameInputProps {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

function RoomNameInput({ register, errors }: RoomNameInputProps) {
  return (
    <>
      <Label htmlFor="roomName">Room Name</Label>
      <Input
        className="mt-2"
        placeholder="Room name...."
        {...register("roomName")}
      />
      {errors.roomName && (
        <p className="text-red-500 text-sm">{errors.roomName.message}</p>
      )}
    </>
  );
}

import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

function DescriptionInput({
  register,
}: {
  register: UseFormRegister<FormValues>;
}) {
  return (
    <>
      <Label htmlFor="description">Description (optional)</Label>
      <Textarea
        className="mt-2 border-1 border-mysecondary"
        placeholder="Description (optional)"
        {...register("description")}
      />
    </>
  );
}

interface ScheduleFieldsProps {
  formType: "schedule" | "host";
  selectedDate: Date;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

function ScheduleFields({
  formType,
  selectedDate,
  setValue,
  errors,
}: ScheduleFieldsProps) {
  if (formType !== "schedule") return null;
  return (
    <div>
      <Label htmlFor="date">Select Date</Label>
      <div className="mt-2">
        <MyDatePicker
          selected={selectedDate}
          onSelect={(date) => {
            if (date) {
              setValue("date", date, { shouldValidate: true });
            }
          }}
        />
      </div>
      {errors.date && (
        <p className="text-red-500 text-sm">{errors.date.message as string}</p>
      )}
      <div className="mt-2">
        <Label htmlFor="duration">Duration in minutes</Label>
        <Select
          defaultValue="30" // Add defaultValue
          onValueChange={(value: string) =>
            setValue("duration", value, { shouldValidate: true })
          }
        >
          <SelectTrigger
            id="duration"
            className=" border-1 border-mysecondary mt-1"
          >
            <SelectValue placeholder="Select Duration" />
          </SelectTrigger>
          <SelectContent className="border-1 border-mysecondary">
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
          </SelectContent>
        </Select>
        {errors.duration && (
          <p className="text-red-500 text-sm">
            {errors.duration.message as string}
          </p>
        )}
      </div>
    </div>
  );
}

interface RoomTypeSelectProps {
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

function RoomTypeSelect({ setValue, errors }: RoomTypeSelectProps) {
  return (
    <div>
      <Label htmlFor="roomType">Room Type</Label>
      <Select
        defaultValue="interview" // Add defaultValue
        onValueChange={(value: string) =>
          setValue("roomType", value as "interview" | "mock" | "pairing", {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          id="roomType"
          className="border-1 border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border-1 border-mysecondary ">
          <SelectItem value="interview">Interview</SelectItem>
          <SelectItem value="mock">Mock</SelectItem>
          <SelectItem value="pairing">Pair Programming</SelectItem>
        </SelectContent>
      </Select>
      {errors.roomType && (
        <p className="text-red-500 text-sm">
          {errors.roomType.message as string}
        </p>
      )}
    </div>
  );
}

interface PrivacyLevelSelectProps {
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

function PrivacyLevelSelect({ setValue, errors }: PrivacyLevelSelectProps) {
  return (
    <div>
      <Label htmlFor="privacyLevel">Room Privacy</Label>
      <Select
        defaultValue="public" // Add defaultValue
        onValueChange={(value: string) =>
          setValue("privacyLevel", value as "public" | "private", {
            shouldValidate: true,
          })
        }
      >
        <SelectTrigger
          id="privacyLevel"
          className="border-1 border-mysecondary mt-1"
        >
          <SelectValue placeholder="Select here" />
        </SelectTrigger>
        <SelectContent className="border-1 border-mysecondary ">
          <SelectItem value="public">Public</SelectItem>
          <SelectItem value="private">Private</SelectItem>
        </SelectContent>
      </Select>
      {errors.privacyLevel && (
        <p className="text-red-500 text-sm">
          {errors.privacyLevel.message as string}
        </p>
      )}
    </div>
  );
}

function EditorEnabledCheckbox({
  register,
}: {
  register: UseFormRegister<FormValues>;
}) {
  return (
    <div className="flex items-center space-x-2 mt-2 mb-4">
      <Input
        type="checkbox"
        id="editorEnabled"
        className="w-4 h-4 accent-primary"
        {...register("editorEnabled")}
      />
      <Label htmlFor="editorEnabled" className="text-sm cursor-pointer">
        Enable others to edit code (This can be changed during the session)
      </Label>
    </div>
  );
}
