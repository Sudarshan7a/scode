// Monaco Editor environment setup for Next.js
// This configures Monaco to work properly in a Next.js environment

export function setupMonacoEnvironment() {
  if (typeof window === "undefined") return;

  // Simple worker factory that falls back gracefully
  (self as unknown as { MonacoEnvironment: unknown }).MonacoEnvironment = {
    getWorkerUrl: function () {
      // For now, return empty to disable workers and avoid errors
      // Monaco will fall back to running in the main thread
      return "";
    },
    getWorker: function () {
      // Create a minimal worker that doesn't crash
      const workerScript = `
        self.onmessage = function(e) {
          // Simple echo worker - doesn't do any processing
          self.postMessage({
            id: e.data.id,
            result: null
          });
        };
      `;

      try {
        const blob = new Blob([workerScript], {
          type: "application/javascript",
        });
        const url = URL.createObjectURL(blob);
        return new Worker(url);
      } catch {
        // Return null to force main thread execution
        return null as Worker | null;
      }
    },
  };
}

// Auto-setup in browser environment
if (typeof window !== "undefined") {
  setupMonacoEnvironment();
}
