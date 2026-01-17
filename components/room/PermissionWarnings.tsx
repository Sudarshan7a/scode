/**
 * Permission denied warning component
 * Shows when browser permissions are denied
 */

import { AlertCircle } from "lucide-react";

interface PermissionDeniedWarningProps {
  device: "camera" | "microphone" | "both";
}

export function PermissionDeniedWarning({
  device,
}: PermissionDeniedWarningProps) {
  const deviceText =
    device === "both"
      ? "camera and microphone"
      : device === "camera"
        ? "camera"
        : "microphone";

  return (
    <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="text-red-900">
          <p className="font-semibold mb-1">
            {deviceText.charAt(0).toUpperCase() + deviceText.slice(1)}{" "}
            permission denied
          </p>
          <p className="text-xs text-red-800 mb-2">
            You previously denied {deviceText} access. To join the call, please:
          </p>
          <ol className="text-xs text-red-800 space-y-1 ml-4 list-decimal">
            <li>
              Click the lock icon{" "}
              <span className="inline-block align-middle">🔒</span> in your
              browser's address bar
            </li>
            <li>Allow {deviceText} access</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

interface PermissionPromptingProps {
  device: "camera" | "microphone" | "both";
}

export function PermissionPrompting({ device }: PermissionPromptingProps) {
  const deviceText =
    device === "both"
      ? "camera and microphone"
      : device === "camera"
        ? "camera"
        : "microphone";

  return (
    <div className="rounded-md border border-blue-300 bg-blue-50 p-3 text-sm">
      <div className="flex items-start gap-2">
        <div className="h-5 w-5 flex-shrink-0 mt-0.5">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
        </div>
        <div className="text-blue-900">
          <p className="font-semibold">Waiting for permission</p>
          <p className="text-xs text-blue-800 mt-1">
            Please allow {deviceText} access in your browser's permission
            prompt.
          </p>
        </div>
      </div>
    </div>
  );
}
