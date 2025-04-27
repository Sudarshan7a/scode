import React from "react";

export default function FooterTextSection() {
  return (
    <div className="md:col-span-1 w-[370px] lg:min-w-[476px] space-y-4">
      <p className=" text-[28px] lg:text-4xl font-medium leading-relaxed">
        <span className="text-mysecondary">Real-time</span> coding with friends,{" "}
        <br />
        Learn <span className="text-mysecondary-hover">fast</span>,
        <br className="block lg:hidden" /> Ace{" "}
        <span className="text-mysecondary">faster</span>.
      </p>
    </div>
  );
}
