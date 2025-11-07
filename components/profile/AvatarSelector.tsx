"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Check } from "lucide-react";

interface AvatarSelectorProps {
  currentAvatarId: number;
  onSelect: (avatarId: number) => void;
}

export function AvatarSelector({ currentAvatarId, onSelect }: AvatarSelectorProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatarId);
  const [isOpen, setIsOpen] = useState(false);

  const avatars = Array.from({ length: 7 }, (_, i) => i);

  const handleSelect = (avatarId: number) => {
    setSelectedAvatar(avatarId);
    onSelect(avatarId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Current Avatar Display */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-mysecondary cursor-pointer hover:border-mysecondary-hover transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src={`/avatars/avatar${selectedAvatar}.jpg`}
            alt={`Avatar ${selectedAvatar}`}
            fill
            className="object-cover"
          />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-mysecondary hover:text-mysecondary-hover font-medium"
        >
          {isOpen ? "Cancel" : "Change Avatar"}
        </button>
      </div>

      {/* Avatar Selection Grid */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white dark:bg-gray-900 border-2 border-mysecondary rounded-lg shadow-xl p-4 z-50">
          <h3 className="text-lg font-semibold mb-3 text-center">Choose your avatar</h3>
          <div className="grid grid-cols-4 gap-3">
            {avatars.map((avatarId) => (
              <div
                key={avatarId}
                className={`relative w-20 h-20 rounded-full overflow-hidden cursor-pointer border-3 transition-all hover:scale-110 ${
                  selectedAvatar === avatarId
                    ? "border-mysecondary ring-4 ring-mysecondary/30"
                    : "border-gray-300 hover:border-mysecondary"
                }`}
                onClick={() => handleSelect(avatarId)}
              >
                <Image
                  src={`/avatars/avatar${avatarId}.jpg`}
                  alt={`Avatar ${avatarId}`}
                  fill
                  className="object-cover"
                />
                {selectedAvatar === avatarId && (
                  <div className="absolute inset-0 bg-mysecondary/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
