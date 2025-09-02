import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

function WelcomeBanner({ username = "Username" }: { username: string }) {
  return (
    <h1 className="pt-12 mx-28 font-title text-title select-none">
      Welcome back{username ? `, ${username}` : "!"}
      <Image
        src="/svg/wavingHand.svg"
        alt="Waving Hand"
        className="inline-block w-12 h-12 "
        width={48}
        height={48}
      />
    </h1>
  );
}

export default WelcomeBanner;
