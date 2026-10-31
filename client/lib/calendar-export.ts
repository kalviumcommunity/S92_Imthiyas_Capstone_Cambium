/**
 * Cambium Research Platform — RFC 5545 iCalendar (.ics) Export Engine
 * Generates standardized calendar invitations for Google Calendar, Apple Calendar, and Outlook.
 */

export interface CalendarEventItem {
  id: string | number;
  title: string;
  description?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string;
  allDay?: boolean;
  url?: string;
  category?: "grant_deadline" | "conference_cfp" | "lab_meeting" | "experiment" | "peer_review";
}

/**
 * Format Date to iCalendar UTC string format: YYYYMMDDTHHMMSSZ or YYYYMMDD for all-day
 */
function formatIcsDate(d: Date, allDay = false): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const year = d.getUTCFullYear();
  const month = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());

  if (allDay) {
    return `${year}${month}${day}`;
  }

  const hours = pad(d.getUTCHours());
  const minutes = pad(d.getUTCMinutes());
  const seconds = pad(d.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape text characters per RFC 5545 specification
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate standard RFC 5545 VCALENDAR payload
 */
export function generateIcsContent(events: CalendarEventItem[]): string {
  const nowStr = formatIcsDate(new Date());

  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Cambium Research Platform//Academic Research OS//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Cambium Academic Deadlines",
    "X-WR-TIMEZONE:UTC",
  ];

  events.forEach((evt) => {
    const sDate = typeof evt.startDate === "string" ? new Date(evt.startDate) : evt.startDate;
    const eDate = evt.endDate
      ? typeof evt.endDate === "string"
        ? new Date(evt.endDate)
        : evt.endDate
      : new Date(sDate.getTime() + (evt.allDay ? 86400000 : 3600000));

    const isAllDay = !!evt.allDay;
    const uid = `cambium-${evt.id}-${sDate.getTime()}@cambium.research`;

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${nowStr}`);

    if (isAllDay) {
      lines.push(`DTSTART;VALUE=DATE:${formatIcsDate(sDate, true)}`);
      lines.push(`DTEND;VALUE=DATE:${formatIcsDate(eDate, true)}`);
    } else {
      lines.push(`DTSTART:${formatIcsDate(sDate)}`);
      lines.push(`DTEND:${formatIcsDate(eDate)}`);
    }

    lines.push(`SUMMARY:${escapeIcsText(evt.title)}`);

    if (evt.description) {
      lines.push(`DESCRIPTION:${escapeIcsText(evt.description)}`);
    }

    if (evt.location) {
      lines.push(`LOCATION:${escapeIcsText(evt.location)}`);
    }

    if (evt.url) {
      lines.push(`URL:${evt.url}`);
    }

    if (evt.category) {
      lines.push(`CATEGORIES:${evt.category.toUpperCase()}`);
    }

    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Download generated .ics file to browser client
 */
export function downloadIcsFile(filename: string, content: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar 1-Click web redirect URL
 */
export function generateGoogleCalendarUrl(evt: CalendarEventItem): string {
  const sDate = typeof evt.startDate === "string" ? new Date(evt.startDate) : evt.startDate;
  const eDate = evt.endDate
    ? typeof evt.endDate === "string"
      ? new Date(evt.endDate)
      : evt.endDate
    : new Date(sDate.getTime() + (evt.allDay ? 86400000 : 3600000));

  const startFormatted = formatIcsDate(sDate, evt.allDay);
  const endFormatted = formatIcsDate(eDate, evt.allDay);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: evt.title,
    dates: `${startFormatted}/${endFormatted}`,
    details: `${evt.description || ""}\n\nManaged via Cambium Research Platform: ${evt.url || "https://cambium.research"}`,
    location: evt.location || "Cambium Research Platform",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
