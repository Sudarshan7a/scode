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
      </p>
    </div>
  );
}

export default HeroSectionTitle;
