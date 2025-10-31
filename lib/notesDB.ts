const DB_NAME = "NotesDB";
const STORE_NAME = "notes";
const DB_VERSION = 1;

export interface NotePage {
  id?: number;
  roomId: string;
  pageNumber: number;
  title: string;
  content: string;
  updatedAt: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });
        store.createIndex("roomId_pageNumber", ["roomId", "pageNumber"], {
          unique: true,
        });
        store.createIndex("roomId", "roomId", { unique: false });
      }
    };
  });
}

export async function savePage(page: NotePage): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("roomId_pageNumber");
    const getRequest = index.get([page.roomId, page.pageNumber]);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      const pageToSave = {
        ...page,
        id: existing?.id,
        updatedAt: Date.now(),
      };
      const putRequest = store.put(pageToSave);
      putRequest.onsuccess = () => resolve();
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function loadPage(
  roomId: string,
  pageNumber: number
): Promise<NotePage | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("roomId_pageNumber");
    const request = index.get([roomId, pageNumber]);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllPages(roomId: string): Promise<NotePage[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("roomId");
    const request = index.getAll(roomId);

    request.onsuccess = () => {
      const pages = request.result || [];
      pages.sort((a, b) => a.pageNumber - b.pageNumber);
      resolve(pages);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deletePage(
  roomId: string,
  pageNumber: number
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("roomId_pageNumber");
    const getRequest = index.get([roomId, pageNumber]);

    getRequest.onsuccess = () => {
      const existing = getRequest.result;
      if (existing) {
        const deleteRequest = store.delete(existing.id);
        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      } else {
        resolve();
      }
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}
