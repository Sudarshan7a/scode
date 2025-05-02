import React from "react";
import TitleBackgroundCard from "@/components/TitleBackgroundCard";
import RoomCard from "@/components/RoomCard";

function YourActivities() {
  return (
    <div className="mb-20">
      <TitleBackgroundCard title="Your Activities">
        <div className="flex flex-col mb-4 w-full gap-4 p-4 mx-auto">
          <div className="flex items-center justify-between w-full mx-auto">
            <h2 className="text-2xl font-secondary font-normal ">
              Recent joined rooms
            </h2>
            <button className="cursor-pointer  pr-4 text-mysecondary-hover hover:text-sky-400">
              View All
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 w-full mx-auto">
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "View",
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
                  label: "View",
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
                  label: "View",
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
                  label: "View",
                  onClick: () => console.log("Ignored room"),
                },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col items-end  w-full gap-4 p-4 mx-auto">
          <div className="flex items-center justify-between w-full mx-auto">
            <h2 className="text-2xl font-secondary font-normal ">
              You hosting rooms
            </h2>
            <button className="cursor-pointer  pr-4 text-mysecondary-hover hover:text-sky-400">
              View All
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 w-full mx-auto">
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "View",
                  onClick: () => console.log("Ignored room"),
                },
                {
                  label: "Recreate",
                  onClick: () => console.log("Recreate room"),
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
                  label: "View",
                  onClick: () => console.log("Ignored room"),
                },
                {
                  label: "Recreate",
                  onClick: () => console.log("Recreate room"),
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
                  label: "View",
                  onClick: () => console.log("Ignored room"),
                },
                {
                  label: "Recreate",
                  onClick: () => console.log("Recreate room"),
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
                  label: "View",
                  onClick: () => console.log("Ignored room"),
                },
                {
                  label: "Recreate",
                  onClick: () => console.log("Recreate room"),
                },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col items-end  w-full gap-4 p-4 mx-auto">
          <div className="flex items-center justify-between w-full mx-auto">
            <h2 className="text-2xl font-secondary font-normal ">
              Your saved notes
            </h2>
            <button className="cursor-pointer  pr-4 text-mysecondary-hover hover:text-sky-400">
              View All
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 w-full mx-auto">
            <RoomCard
              title="Room Title"
              description="Description of the upcoming room."
              date="Weekday, DD/MM/YYYY"
              username="username"
              buttons={[
                {
                  label: "Open",
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
                  label: "Open",
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
                  label: "Open",
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
                  label: "Open",
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

export default YourActivities;
