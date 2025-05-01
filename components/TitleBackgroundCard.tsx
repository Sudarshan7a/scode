import React from "react";

function TitleBackgroundCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-3xl">{title}</h1>
      {children}
    </div>
  );
}

export default TitleBackgroundCard;
