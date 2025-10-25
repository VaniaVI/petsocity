import { useEffect } from "react";

export function useBootstrap() {
  useEffect(() => {
    const loadBootstrap = async () => {
      if (typeof window !== "undefined" && !window.bootstrap) {
        const bootstrap = await import(
          "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        );
        window.bootstrap = bootstrap;
      }
    };
    loadBootstrap();
  }, []);
}
