import React from "react";
import MySheetDemo from "../custom/MySheetDemo";

function SortBy() {
  return (
    <div>
      <MySheetDemo
        title="Sort By"
        headTitle="Sort By your Choice"
        headDescription="Select the criteria to sort your search results."
        sortBy={[
          {
            title: "Time",
            options: [
              "Upcoming",
              "Live Now",
              "Later Today",
              "Later This Week",
              "Later This Month",
            ],
          },
          {
            title: "Language",
            options: [
              "Python",
              "JavaScript",
              "Java",
              "C++",
              "Go",
            ],
          },
          {
            title: "Room Type",
            options: [
              "Interview",
              "Pair Programming",
              "Coding Challenge",
              "Mock Assessment",
              "Debugging Session",
            ],
          },
          {
            title: "Name",
            radio: true,
            options: ["Room Title: A–Z", "Room Title: Z–A"],
          },
          {
            title: "Duration",
            radio: true,
            options: ["Shortest to Longest", "Longest to Shortest"],
          },
        ]}
      />
    </div>
  );
}

export default SortBy;
