import React from "react";
import MainContent from "../../../components/joinRoom/MainContent";
import BottomBar from "../../../components/joinRoom/BottomBar";

function LeftTools() {
  return (
    <div className="w-full h-full flex flex-col ">
      <MainContent renderTab="Notes" />
      <BottomBar />
    </div>
  );
}

export default LeftTools;
