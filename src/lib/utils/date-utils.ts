import { format } from "date-fns";

/**
 * Format a date in Pakistan Standard Time (PKT - UTC+5)
 * If formatStr is provided, it uses date-fns format.
 */
export function formatPKT(date: Date | string | number, formatStr?: string) {
    const d = new Date(date);
    
    // If a specific format string is requested, use it through date-fns
    if (formatStr) {
        return format(d, formatStr);
    }

    // Default: Return high-readability Intl format
    return new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        dateStyle: "medium",
        timeStyle: "short",
    }).format(d);
}

export function getCurrentPKT() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }));
}

export function toPKTDateString(date: Date) {
    return format(new Date(date.toLocaleString("en-US", { timeZone: "Asia/Karachi" })), "yyyy-MM-dd");
}
