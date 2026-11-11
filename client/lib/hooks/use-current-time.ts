import { useSyncExternalStore } from "react";

type Listener = () => void;

let currentTime: number | null = null;
let interval: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<Listener>();

function notifyTimeChange() {
  currentTime = Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  if (listeners.size === 1) {
    notifyTimeChange();
    interval = setInterval(notifyTimeChange, 60_000);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  };
}

function getSnapshot() {
  return currentTime;
}

function getServerSnapshot() {
  return null;
}

export function useCurrentTime() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
