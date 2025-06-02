/**
 * Utility functions for date formatting
 */

/**
 * Formats a date string or null value into a readable format
 * @param dateString - The date string to format or null
 * @returns Formatted date string or "TBD" if null
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formats a date string into a short format (MM/DD/YYYY)
 * @param dateString - The date string to format
 * @returns Formatted date string in short format
 */
export const formatDateShort = (dateString: string | null): string => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

/**
 * Formats a date string into time format (HH:MM AM/PM)
 * @param dateString - The date string to format
 * @returns Formatted time string
 */
export const formatTime = (dateString: string | null): string => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
