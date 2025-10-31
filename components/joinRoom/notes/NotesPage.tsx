"use client";
import React, { useState, useEffect } from "react";
import Pages from "./pagesPanel";
import Note from "./Note";
import { getAllPages, savePage } from "@/lib/notesDB";

interface NotesPageProps {
  sessionId: string;
}

function NotesPage({ sessionId }: NotesPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    initializePages();
  }, [sessionId]);

  const initializePages = async () => {
    try {
      const pages = await getAllPages(sessionId);
      if (pages.length === 0) {
        // Create first page if none exist
        await savePage({
          roomId: sessionId,
          pageNumber: 1,
          title: "Page 1",
          content: "",
          updatedAt: Date.now(),
        });
        setPageCount(1);
        setCurrentPage(1);
      } else {
        setPageCount(pages.length);
        setCurrentPage(pages[0].pageNumber);
      }
    } catch (error) {
      console.error("Failed to initialize pages:", error);
    }
  };

  const handleCreatePage = async () => {
    try {
      const pages = await getAllPages(sessionId);
      const newPageNumber = pages.length > 0 
        ? Math.max(...pages.map(p => p.pageNumber)) + 1 
        : 1;
      
      await savePage({
        roomId: sessionId,
        pageNumber: newPageNumber,
        title: `Page ${newPageNumber}`,
        content: "",
        updatedAt: Date.now(),
      });
      
      setPageCount(prev => prev + 1);
      setCurrentPage(newPageNumber);
    } catch (error) {
      console.error("Failed to create page:", error);
    }
  };

  const handlePageSelect = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="flex text-center h-[94vh] ">
      <Pages 
        roomId={sessionId}
        currentPage={currentPage}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
      />
      <Note 
        key={currentPage}
        sessionId={sessionId} 
        pageNumber={currentPage}
      />
    </div>
  );
}

export default NotesPage;
