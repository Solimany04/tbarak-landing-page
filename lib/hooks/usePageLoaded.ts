"use client"
import { useEffect, useState } from "react";

/** False until the window "load" event has fired (always false while server-rendering). */
export function usePageLoaded() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return loaded;
}
