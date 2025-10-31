"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getAllPages, type NotePage } from "@/lib/notesDB";
import { Plus } from "lucide-react";

const MAX_PAGES = 10;

interface PagesPanelProps {
  roomId: string;
  currentPage: number;
  onPageSelect: (pageNumber: number) => void;
  onCreatePage: () => void;
  onPagesLoad: (pages: NotePage[]) => void;
}

function Pages({ roomId, currentPage, onPageSelect, onCreatePage, onPagesLoad }: PagesPanelProps) {
  const [pages, setPages] = useState<NotePage[]>([]);

  const loadPages = useCallback(async () => {
    try {
      const allPages = await getAllPages(roomId);
      setPages(allPages);
      onPagesLoad(allPages);
    } catch (error) {
      console.error("Failed to load pages:", error);
    }
  }, [roomId, onPagesLoad]);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const canAddMore = pages.length < MAX_PAGES;

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
        {canAddMore && (
          <div 
            onClick={onCreatePage}
            className="bg-mysecondary-hover w-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h3 className="font-title p-1 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </h3>
          </div>
        )}
        {!canAddMore && (
          <div className="bg-gray-600 w-full opacity-50 cursor-not-allowed">
            <h3 className="font-title p-1 text-xs text-center">Max pages</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pages;
