import React from "react";

function TitleBackgroundCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-80% mx-20">
      <h1 className="text-3xl font-secondary font-normal mb-4">{title}</h1>
      <div
        style={{ boxShadow: "0px 0px 2px 1px var(--color-mysecondary)" }}
        className="flex flex-col items-center w-full p-2 rounded-2xl"
      >
        {children}
      </div>
    </div>
  );
}

export default TitleBackgroundCard;
