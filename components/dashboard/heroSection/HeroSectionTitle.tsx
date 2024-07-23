import { axiosInstance } from "@/lib/axiosInstance";

import React, { useEffect } from "react";

function HeroSectionTitle() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get(`${origin}/api/auth/test_request`, {});
      } catch {
        // Error fetching data - handle silently
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-title font-bold tracking-tight text-myforeground font-secondary  select-none">
        Code with friends and{" "}
        <span className="text-primary">mock-Interviews</span> for Everyone
      </h1>
      <p className="mt-2 text-lg font-medium text-myforeground/80 font-secondary">
        `` Connect, Collaborate, and Code in Real-Time
        <button
          className="ml-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition-colors"
          onClick={async () => {
            try {
              const result = await axiosInstance.get(
                `${origin}/api/auth/test_request`,
                {}
              );
              console.log("Fetched data:", result.data);
            } catch {
              // Error fetching data - handle silently
            }
          }}
        >
          Click me
        </button>
      </p>
    </div>
  );
}

export default HeroSectionTitle;
