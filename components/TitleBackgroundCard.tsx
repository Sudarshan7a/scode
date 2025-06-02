import React from "react";

function TitleBackgroundCard({
  noShadow = false,
  title,
  children,
  hidebutton = false,
}: {
  noShadow?: boolean;
  title?: string;
  children: React.ReactNode;
  hidebutton?: boolean;
}) {
  return (
    <div className="min-w-[80%] mx-20">
      <h1 className="text-3xl font-secondary font-normal mb-4">{title}</h1>
      <div
        style={{
          boxShadow: noShadow
            ? "none"
            : "0px 0px 2px 1px var(--color-mysecondary)",
        }}
        className="flex shadow-md flex-col items-center w-full p-2 rounded-2xl"
      >
        <div className="flex flex-col items-end  w-full gap-4  mx-auto ">
          {!hidebutton && (
            <button className=" pr-4 text-mysecondary-hover hover:text-sky-400">
              View All
            </button>
          )}
          <div className="flex items-center justify-center gap-4 flex-wrap mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitleBackgroundCard;
