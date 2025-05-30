import React from "react";
import MySheetDemo from "../custom/MySheetDemo";

function Filter() {
  return (
    <MySheetDemo
      title="Filter"
      headTitle="Filter by your Choice"
      headDescription="Select the criteria to filter your search results."
      filters={[
        {
          title: "Language",
          options: ["Python", "JavaScript", "Java", "C++"],
        },
        {
          title: "status",
          options: ["Live", "Scheduled"],
        },
        {
          title: "Type",
          options: ["Interview", "Pair Programming", "Coding Challenge"],
        },
      ]}
    />
  );
}

export default Filter;
