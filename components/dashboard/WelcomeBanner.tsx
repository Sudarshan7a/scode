import Image from "next/image";
import React from "react";

function WelcomeBanner({ username = "Username" }: { username: string }) {
  // let a = username.toLowerCase();
  // let up = a[0].toUpperCase();
  // username = up + a.slice(1);
  if (username) {
    username = username.charAt(0).toUpperCase() + username.slice(1);
  } else {
    username = "";
  }
  return (
    <h1 className="pt-12 mx-28 font-title text-title select-none">
      Welcome back {username}
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
