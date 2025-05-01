import Image from "next/image";
import React from "react";

function WelcomeBanner({ username = "Username" }: { username: string }) {
  return (
    <h1 className="py-12 mx-28 font-title text-title select-none">
      Welcome back! {username}{" "}
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
