"use client"
import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}

/** False until the window "load" event has fired (always false while server-rendering). */
export function usePageLoaded() {
  return useSyncExternalStore(
    subscribe,
    () => document.readyState === "complete",
    () => false,
  );
}
