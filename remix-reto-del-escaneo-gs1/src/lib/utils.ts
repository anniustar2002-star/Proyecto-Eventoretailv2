import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const ms = String(milliseconds % 1000).padStart(3, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  
  if (minutes === '00') {
    return `${seconds}.${ms}s`;
  }
  return `${minutes}:${seconds}.${ms}s`;
}
