/**
 * Business Rules:
 * - Monday to Friday: 8.5 hours (10:00 AM to 6:30 PM)
 * - Saturday: 4 hours (10:00 AM to 2:00 PM)
 * - Sunday: Off
 */

/**
 * Check if a date is a working day (Monday-Saturday)
 */
export function isWorkingDay(date) {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return dayOfWeek >= 1 && dayOfWeek <= 6; // Monday to Saturday
}

/**
 * Get expected working hours for a given date
 */
export function getExpectedHours(date) {
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) {
    // Sunday - off
    return 0;
  } else if (dayOfWeek === 6) {
    // Saturday - half day (4 hours)
    return 4;
  } else {
    // Monday to Friday - full day (8.5 hours)
    return 8.5;
  }
}

/**
 * Parse time string to minutes since midnight
 * Handles formats like "10:00", "10:00 AM", "10:00:00", etc.
 */
function parseTimeToMinutes(timeStr) {
  if (!timeStr) return null;

  let time = String(timeStr).trim().toUpperCase();
  // Normalize and remove extra whitespace
  // If seconds are present (HH:MM:SS), drop the seconds portion
  if (time.match(/^\d{1,2}:\d{2}:\d{2}/)) {
    time = time.replace(/:\d{2}$/, '');
  }

  // Handle AM/PM format
  let isPM = false;
  if (time.includes('PM')) {
    isPM = true;
    time = time.replace('PM', '').trim();
  } else if (time.includes('AM')) {
    time = time.replace('AM', '').trim();
  }

  const parts = time.split(':');
  if (parts.length < 2) {
    // Sometimes times may be like '1000' or '1000AM' - attempt to parse HHMM
    const numeric = time.replace(/[^0-9]/g, '');
    if (numeric.length === 4) {
      const hours = parseInt(numeric.slice(0, 2), 10);
      const minutes = parseInt(numeric.slice(2), 10);
      if (isNaN(hours) || isNaN(minutes)) return null;
      let hh = hours;
      if (isPM && hh !== 12) hh += 12;
      if (!isPM && hh === 12) hh = 0;
      return hh * 60 + minutes;
    }
    return null;
  }

  let hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) return null;

  // Handle 12-hour format
  if (isPM && hours !== 12) {
    hours += 12;
  } else if (!isPM && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
}

/**
 * Calculate worked hours between in-time and out-time
 * Returns hours as decimal (e.g., 8.5 for 8 hours 30 minutes)
 */
export function calculateWorkedHours(inTimeStr, outTimeStr, date) {
  const inMinutes = parseTimeToMinutes(inTimeStr);
  const outMinutes = parseTimeToMinutes(outTimeStr);

  if (inMinutes === null || outMinutes === null) {
    return 0;
  }

  // Handle overnight shifts (if out-time is before in-time, assume next day)
  let workedMinutes = outMinutes - inMinutes;
  if (workedMinutes < 0) {
    workedMinutes += 24 * 60; // Add 24 hours
  }

  // Convert to decimal hours
  const workedHours = workedMinutes / 60;

  // Get expected hours for the day
  const expectedHours = getExpectedHours(date);

  // Cap worked hours at expected hours (can't work more than expected)
  return Math.min(workedHours, expectedHours);
}

/**
 * Calculate total expected hours for a month
 */
export function getExpectedHoursForMonth(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  let totalExpected = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    totalExpected += getExpectedHours(date);
  }

  return totalExpected;
}

/**
 * Calculate productivity percentage
 */
export function calculateProductivity(actualHours, expectedHours) {
  if (expectedHours === 0) return 0;
  return (actualHours / expectedHours) * 100;
}

