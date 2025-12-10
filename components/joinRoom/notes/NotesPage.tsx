"use client";
import React, { useState, useEffect, useCallback } from "react";
import Pages from "./pagesPanel";
import Note from "./Note";
import { getAllPages, savePage, deletePage } from "@/lib/notesDB";

interface NotesPageProps {
  sessionId: string;
}

function NotesPage({ sessionId }: NotesPageProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<Awaited<ReturnType<typeof getAllPages>>>(
    []
  );

  const initializePages = useCallback(async () => {
    try {
      const pages = await getAllPages(sessionId);
      if (pages.length === 0) {
        await savePage({
          id: `${sessionId}-page-0`,
          roomId: sessionId,
          pageNumber: 0,
          title: "Page 0",
          content: "",
          updatedAt: Date.now(),
        });
        const newPages = await getAllPages(sessionId);
        setPages(newPages);
        setCurrentPage(0);
      } else {
        setPages(pages);
        setCurrentPage(pages[0].pageNumber);
      }
    } catch (error) {
      console.error("Failed to initialize pages:", error);
    }
  }, [sessionId]);

  useEffect(() => {
    initializePages();
  }, [initializePages]);

  const handlePagesLoad = useCallback(
    async (loadedPages: Awaited<ReturnType<typeof getAllPages>>) => {
      setPages(loadedPages);
      if (
        loadedPages.length > 0 &&
        !loadedPages.find((p) => p.pageNumber === currentPage)
      ) {
        setCurrentPage(loadedPages[0].pageNumber);
      }
    },
    [currentPage]
  );

  const handleCreatePage = async () => {
    try {
      if (pages.length >= 10) return;

      const currentPages = await getAllPages(sessionId);
      const existingNumbers = currentPages.map((p) => p.pageNumber);

      // Find first available number from 0-9
      let newPageNumber = 0;
      for (let i = 0; i < 10; i++) {
        if (!existingNumbers.includes(i)) {
          newPageNumber = i;
          break;
        }
      }

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

  const handleDeletePage = async () => {
    try {
      if (pages.length <= 1) {
        alert("Cannot delete the last page");
        return;
      }

      const pageToDelete = currentPage;
      await deletePage(sessionId, pageToDelete);

      const updatedPages = await getAllPages(sessionId);
      setPages(updatedPages);

      // Switch to first available page that's not the deleted one
      const nextPage = updatedPages.find((p) => p.pageNumber !== pageToDelete);
      if (nextPage) {
        setCurrentPage(nextPage.pageNumber);
      } else if (updatedPages.length > 0) {
        setCurrentPage(updatedPages[0].pageNumber);
      }
    } catch (error) {
      console.error("Failed to delete page:", error);
    }
  };

  return (
    <div className="flex text-center h-full ">
      <Pages
        roomId={sessionId}
        currentPage={currentPage}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
        onPagesLoad={handlePagesLoad}
        pages={pages}
      />
      <Note
        key={`${sessionId}-page-${currentPage}`}
        sessionId={sessionId}
        pageNumber={currentPage}
        onDelete={handleDeletePage}
      />
    </div>
  );
}

export default NotesPage;
