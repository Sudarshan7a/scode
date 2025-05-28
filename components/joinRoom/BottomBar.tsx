import React from "react";

function BottomBar() {
  return (
    <div className="font-navbar text-xl font-normal h-[6vh] flex  border-t-1 border-t-myforeground bg-mybackground">
      <div className=" flex-1 flex items-center justify-center my-auto h-9/12  border-r-1 border-r-myforeground text-center">
        <p>Notes</p>
      </div>
      <div className="flex-1 flex items-center justify-center my-auto h-9/12  text-center border-r-1 border-r-myforeground self-center">
        <p>Participants</p>
      </div>
      <div className="flex-1 flex items-center justify-center my-auto h-9/12  text-center self-center">
        <p className="">Gemini</p>
      </div>
    </div>
  );
}

export default BottomBar;
