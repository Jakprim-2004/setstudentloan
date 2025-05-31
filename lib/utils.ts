import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { th } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(timestamp: any): string {
  if (!timestamp) return "-"

  try {
    // Convert Firestore Timestamp to JavaScript Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return format(date, "d MMMM yyyy, HH:mm", { locale: th })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "-"
  }
}
