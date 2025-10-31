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
  const [pages, setPages] = useState<Awaited<ReturnType<typeof getAllPages>>>([]);

  useEffect(() => {
    initializePages();
  }, [sessionId]);

  const initializePages = async () => {
    try {
      const pages = await getAllPages(sessionId);
      if (pages.length === 0) {
        await savePage({
          id: `${sessionId}-page-1`,
          roomId: sessionId,
          pageNumber: 1,
          title: "Page 1",
          content: "",
          updatedAt: Date.now(),
        });
        const newPages = await getAllPages(sessionId);
        setPages(newPages);
        setCurrentPage(1);
      } else {
        setPages(pages);
        setCurrentPage(pages[0].pageNumber);
      }
    } catch (error) {
      console.error("Failed to initialize pages:", error);
    }
  };

  const handlePagesLoad = (loadedPages: Awaited<ReturnType<typeof getAllPages>>) => {
    setPages(loadedPages);
  };

  const handleCreatePage = async () => {
    try {
      if (pages.length >= 10) return;

      const currentPages = await getAllPages(sessionId);
      const newPageNumber = currentPages.length > 0 
        ? Math.max(...currentPages.map(p => p.pageNumber)) + 1 
        : 1;
      
      await savePage({
        id: `${sessionId}-page-${newPageNumber}`,
        roomId: sessionId,
        pageNumber: newPageNumber,
        title: `Page ${newPageNumber}`,
        content: "",
        updatedAt: Date.now(),
      });
      
      const updatedPages = await getAllPages(sessionId);
      setPages(updatedPages);
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
        onPagesLoad={handlePagesLoad}
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
