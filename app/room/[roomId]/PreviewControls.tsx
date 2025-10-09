"use client";

import {
  StreamTheme,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
} from "@stream-io/video-react-sdk";
/**
 * Preview control buttons for camera and microphone using Stream's built-in components.
 * These components automatically handle state management, loading states, and accessibility.
 */
export function PreviewControls() {
  return (
    <StreamTheme>
      <div className="flex gap-4 justify-center items-center">
        <div className="[&_button]:bg-gray-800 [&_button]:hover:bg-gray-700 [&_button]:text-white [&_button]:p-3 [&_button]:rounded-full [&_button]:transition-colors [&_button]:border [&_button]:border-gray-600">
          <ToggleAudioPreviewButton />
        </div>
        <div className="[&_button]:bg-gray-800 [&_button]:hover:bg-gray-700 [&_button]:text-white [&_button]:p-3 [&_button]:rounded-full [&_button]:transition-colors [&_button]:border [&_button]:border-gray-600">
          <ToggleVideoPreviewButton />
        </div>
      </div>
    </StreamTheme>
  );
}
