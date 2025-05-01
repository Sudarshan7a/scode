import React from "react";

function Button({ label, className }: { label: string; className?: string }) {
  return <div className={className}>{label}</div>;
}

export default Button;
