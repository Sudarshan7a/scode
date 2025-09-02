"use client";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axiosInstance";

function WelcomeBanner({ username = "Username" }: { username: string }) {
  const [loremText, setLoremText] = useState("");

  useEffect(() => {
    // Call the protected test_request route. axiosInstance attaches the access token
    // automatically via the request interceptor in `lib/axiosInstance.ts`.
    const fetchProtected = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/test_request");
        const data = response.data;
        // The route returns { message: "Token received", userId }
        setLoremText(
          typeof data === "string" ? data : data.message ?? JSON.stringify(data)
        );
      } catch (err) {
        console.error("Failed to fetch protected resource:", err);
      }
    };

    fetchProtected();
  }, []);
  return (
    <h1 className="pt-12 mx-28 font-title text-title select-none">
      Welcome back! {loremText}{" "}
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
