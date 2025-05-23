import React from "react";

const initialPageTitles = [
  "Page 1",
  "Page 2",
  "Page 3",
  "Page 4",
  "Page 5",
  "Page 6",
]; // Define the array as a constant

function Pages() {
  return (
    <div className="flex-1 py-8 p-4 border-r-1 border-r-foreground">
      <h2 className="mb-4 text-mysecondary-hover font-semibold rounded-sm p-1 font-secondary text-2xl w-full">
        Pages
      </h2>
      <div className="flex flex-col space-y-2 text-md text-foreground">
        {initialPageTitles.map((pageTitle, index) => (
          <div key={pageTitle} className="bg-mysecondary-hover w-full">
            <h3
              className={`font-title ${
                index === 0 ? "border-b-mysecondary border-b-4" : ""
              }`}
            >
              {pageTitle}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pages;
