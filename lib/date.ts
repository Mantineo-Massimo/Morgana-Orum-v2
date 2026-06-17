/**
 * Utility functions for handling dates and times in the Italian Timezone (Europe/Rome).
 */

export function getRomeParts(date: Date): { year: number, month: number, day: number, hour: number, minute: number, second: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });
  
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};
  for (const part of parts) {
    map[part.type] = part.value;
  }
  
  return {
    year: parseInt(map.year, 10),
    month: parseInt(map.month, 10),
    day: parseInt(map.day, 10),
    hour: parseInt(map.hour, 10) % 24,
    minute: parseInt(map.minute, 10),
    second: parseInt(map.second, 10)
  };
}

export function getRomeOffsetMs(date: Date): number {
  const parts = getRomeParts(date);
  const localUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return localUtc - date.getTime();
}

/**
 * Converts a local Rome time date input (e.g. "2026-06-17T07:13" or a Date object representing Rome time components)
 * to a UTC Date object.
 */
export function toUtcFromRome(dateInput: Date | string | number | null | undefined): Date {
  if (!dateInput) return new Date();
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return d;
  
  let year: number, month: number, day: number, hours: number, minutes: number, seconds: number;
  
  if (typeof dateInput === 'string') {
    const normalized = dateInput.replace(' ', 'T');
    if (normalized.includes('T')) {
      const [datePart, timePart] = normalized.split('T');
      const [y, m, dayPart] = datePart.split('-').map(Number);
      const timeComponents = timePart.split(':').map(Number);
      year = y;
      month = m - 1;
      day = dayPart;
      hours = timeComponents[0] || 0;
      minutes = timeComponents[1] || 0;
      seconds = timeComponents[2] || 0;
    } else {
      const [y, m, dayPart] = normalized.split('-').map(Number);
      year = y;
      month = m - 1;
      day = dayPart;
      hours = 0;
      minutes = 0;
      seconds = 0;
    }
  } else {
    const dateObj = new Date(dateInput);
    year = dateObj.getFullYear();
    month = dateObj.getMonth();
    day = dateObj.getDate();
    hours = dateObj.getHours();
    minutes = dateObj.getMinutes();
    seconds = dateObj.getSeconds();
  }
  
  // Construct a UTC Date where the UTC components match the input local components
  const localUtc = new Date(Date.UTC(year, month, day, hours, minutes, seconds, 0));
  
  // Estimate offset and adjust
  const offset = getRomeOffsetMs(localUtc);
  const corrected = new Date(localUtc.getTime() - offset);
  
  // Refine once on the corrected date to handle DST transitions perfectly
  const finalOffset = getRomeOffsetMs(corrected);
  return new Date(localUtc.getTime() - finalOffset);
}

/**
 * Formats a UTC Date to a local ISO string (YYYY-MM-DDTHH:mm) in Europe/Rome timezone,
 * suitable for <input type="datetime-local">.
 */
export function toRomeInputString(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  
  const parts = getRomeParts(d);
  const y = parts.year;
  const m = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  const h = String(parts.hour).padStart(2, '0');
  const min = String(parts.minute).padStart(2, '0');
  
  return `${y}-${m}-${day}T${h}:${min}`;
}

/**
 * Formats a UTC Date to a local date string (YYYY-MM-DD) in Europe/Rome timezone,
 * suitable for <input type="date">.
 */
export function toRomeDateInputString(dateInput: Date | string | number | null | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  
  const parts = getRomeParts(d);
  const y = parts.year;
  const m = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');
  
  return `${y}-${m}-${day}`;
}

/**
 * Formats a date using local timezone option Europe/Rome.
 */
export function formatRomeDate(date: Date | string | number | null | undefined, locale: string = 'it-IT', options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleDateString(locale, {
    timeZone: 'Europe/Rome',
    ...options
  });
}

/**
 * Formats a time using local timezone option Europe/Rome.
 */
export function formatRomeTime(date: Date | string | number | null | undefined, locale: string = 'it-IT', options?: Intl.DateTimeFormatOptions): string {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  return d.toLocaleTimeString(locale, {
    timeZone: 'Europe/Rome',
    ...options
  });
}
