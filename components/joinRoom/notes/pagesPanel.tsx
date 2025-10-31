"use client";
import React, { useEffect, useState } from "react";
import { getAllPages, type NotePage } from "@/lib/notesDB";
import { Plus } from "lucide-react";

interface PagesPanelProps {
  roomId: string;
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
  onCreatePage: () => void;
}

function Pages({ roomId, currentPage, onPageSelect, onCreatePage }: PagesPanelProps) {
  const [pages, setPages] = useState<NotePage[]>([]);

  useEffect(() => {
    loadPages();
  }, [roomId]);

  const loadPages = async () => {
    try {
      const allPages = await getAllPages(roomId);
      setPages(allPages);
    } catch (error) {
      console.error("Failed to load pages:", error);
    }
  };

  return (
    <div className="flex-1 max-w-36 py-8 p-4 border-r-1 border-r-foreground">
      <h2 className="mb-4 text-mysecondary-hover font-semibold font-secondary text-2xl">
        Pages
      </h2>
      <div className="flex flex-col space-y-2 text-md text-foreground">
        {pages.map((page) => (
          <div
            key={page.pageNumber}
            onClick={() => onPageSelect(page.pageNumber)}
            className={`bg-mysecondary-hover w-full cursor-pointer hover:opacity-80 transition-opacity ${
              currentPage === page.pageNumber ? "border-b-mysecondary border-b-4" : ""
            }`}
          >
            <h3 className="font-title p-1 truncate">{page.title}</h3>
          </div>
        ))}
        <div 
          onClick={onCreatePage}
          className="bg-mysecondary-hover w-full cursor-pointer hover:opacity-80 transition-opacity"
        >
          <h3 className="font-title p-1 flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Pages;
