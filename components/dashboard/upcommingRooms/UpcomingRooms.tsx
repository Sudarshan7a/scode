import RoomCard from "@/components/RoomCard";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import React from "react";

function UpcomingRooms() {
  return (
    <div className="mb-20 ">
      <TitleBackgroundCard title="Upcoming Rooms">
        <div className="flex flex-col items-end  w-full gap-4 p-4 mx-auto ">
          <button className=" pr-4 text-mysecondary-hover hover:text-sky-400">
            View All
          </button>
          <div className="flex items-center justify-center gap-2 w-full mx-auto">
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "Ignore",
                  onClick: () => console.log("Ignored room"),
                },
              ]}
            />
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "Ignore",
                  onClick: () => console.log("Ignored room"),
                },
              ]}
            />
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "Ignore",
                  onClick: () => console.log("Ignored room"),
                },
              ]}
            />
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "Ignore",
                  onClick: () => console.log("Ignored room"),
                },
              ]}
            />
          </div>
        </div>
      </TitleBackgroundCard>
    </div>
  );
}

export default UpcomingRooms;
