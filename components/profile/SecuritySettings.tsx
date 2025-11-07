"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { CircleCheck, CircleX } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/useToast";
import { axiosInstance } from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface UserProfile {
  id: string;
  email: string;
  oauth?: {
    google?: { id: string; email: string };
    github?: { id: string; username: string };
  };
}

export function SecuritySettings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { error: showError, success } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Use /api/user/me endpoint which reads httpOnly cookies server-side
      const response = await axiosInstance.get("/api/user/me");

      if (response.data.success && response.data.authenticated) {
        setIsAuthenticated(true);
        setProfile(response.data.user);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Failed to load profile:", err);

      // If 401 (not authenticated), don't show error toast
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
      } else {
        showError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            User not authenticated
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access security settings.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="bg-mysecondary hover:bg-mysecondary-hover text-white px-8 py-2"
        >
          Login
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          Loading security settings...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">
          Failed to load security settings
        </div>
      </div>
    );
  }

  return (
    <div className="mx-40">
      <EmailSection email={profile.email} />
      <SecurityForm />
      <OAuthLink oauth={profile.oauth} />
    </div>
  );
}

interface EmailSectionProps {
  email: string;
}

function EmailSection({ email }: EmailSectionProps) {
  const [showChangeEmail, setShowChangeEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [sending, setSending] = useState(false);
  const { error: showError, success, promise } = useToast();

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newEmail || newEmail === email) {
      showError("Please enter a different email address");
      return;
    }

    try {
      setSending(true);
      const response = await axiosInstance.post("/api/user/change-email", {
        newEmail,
      });

      if (response.data.success) {
        success(
          response.data.message ||
            "Verification link sent to your new email address"
        );
        setShowChangeEmail(false);
        setNewEmail("");
      }
    } catch (err: any) {
      console.error("Failed to change email:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to send verification link";
      showError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Email Address</h2>
      <div className="flex items-center gap-4">
        <Input
          value={email}
          disabled
          className="flex-1 bg-gray-100 dark:bg-gray-800"
        />
        <Button
          onClick={() => setShowChangeEmail(!showChangeEmail)}
          variant="outline"
          className="border-mysecondary text-mysecondary hover:bg-mysecondary hover:text-white"
        >
          {showChangeEmail ? "Cancel" : "Change"}
        </Button>
      </div>

      {showChangeEmail && (
        <form
          onSubmit={handleChangeEmail}
          className="mt-4 p-4 border border-mysecondary rounded-lg bg-mysecondary/5"
        >
          <h3 className="font-medium mb-3">Change Email Address</h3>
          <div className="mb-4">
            <label className="block mb-1 text-sm">New Email Address</label>
            <Input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              required
            />
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            A verification link will be sent to your new email. Please verify to
            complete the update.
          </p>
          <Button
            type="submit"
            disabled={sending}
            className="w-full bg-mysecondary hover:bg-mysecondary-hover text-white"
          >
            {sending ? "Sending..." : "Send Verification Link"}
          </Button>
        </form>
      )}
    </div>
  );
}

function SecurityForm() {
  return (
    <form className="w-full text-sm font-medium font-sans mt-4">
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

function OAuthLink({ oauth }: { oauth?: UserProfile["oauth"] }) {
  const isGoogleConnected = !!oauth?.google;
  const isGithubConnected = !!oauth?.github;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Connected Accounts</h2>
      <div className="flex flex-col gap-3">
        {/* Google Account */}
        <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/svg/google.svg"
                alt="Google"
                width={40}
                height={40}
              />
            </div>
            <div>
              <p className="font-medium">Google Account</p>
              {isGoogleConnected && oauth?.google?.email && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {oauth.google.email}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGoogleConnected ? (
              <>
                <CircleCheck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Connected
                </span>
              </>
            ) : (
              <>
                <CircleX className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Not connected
                </span>
              </>
            )}
          </div>
        </div>

        {/* GitHub Account */}
        <div className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/svg/github.svg"
                alt="GitHub"
                width={40}
                height={40}
                className="dark:invert"
              />
            </div>
            <div>
              <p className="font-medium">GitHub Account</p>
              {isGithubConnected && oauth?.github?.username && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  @{oauth.github.username}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isGithubConnected ? (
              <>
                <CircleCheck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Connected
                </span>
              </>
            ) : (
              <>
                <CircleX className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  Not connected
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
