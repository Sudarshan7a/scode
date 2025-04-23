import React from "react";
import Link from "next/link";

interface FooterLink {
  href: string;
  label: string;
  isExternal?: boolean; // Flag to determine if it's an external link
}

interface FooterLinkListProps {
  title: string;
  links: FooterLink[];
}

export default function FooterLinkList({ title, links }: FooterLinkListProps) {
  return (
    <div>
      <h3 className="font-normal text-[20px] mb-3 ">{title}</h3>
      <ul className="space-y-2 font-light text-[16px]">
        {links.map((link) => (
          <li key={link.href}>
            {link.isExternal ? (
              <Link
                href={link.href}
                target="_blank" // Open external links in new tab
                rel="noopener noreferrer" // Security best practice
                className="hover:text-primary transition-colors" // Added hover effect
              >
                {link.label}
              </Link>
            ) : (
              <Link
                href={link.href}
                className="hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
