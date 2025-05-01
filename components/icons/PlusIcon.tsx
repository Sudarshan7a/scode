import React from "react";

interface PlusIconProps {
  className?: string;
}

function PlusIcon({ className = "" }: PlusIconProps) {
  return (
    <svg
      className={`${className} fill-mybackground`}
      xmlns="http://www.w3.org/2000/svg"
      height="40px"
      viewBox="0 -960 960 960"
      width="40px"
    >
      <path d="M432.12-431.88H174.15v-96.44h257.97v-258.91h96.43v258.91h257.68v96.44H528.55v257.3h-96.43v-257.3Z" />
    </svg>
  );
}

export default PlusIcon;
