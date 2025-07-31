import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);
// Set default timezone to local (can be adjusted if needed)
const userTimezone = dayjs.tz.guess();
// Update relative time thresholds for more accurate "ago" text
dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});
/**
 * Format a UTC date string to local timezone with a user-friendly format
 * @param {string} dateString - UTC date string from the backend
 * @param {string} [format='MMM D, YYYY h:mm A'] - Optional format string
 * @param {string} [targetTimezone=userTimezone] - Target timezone (defaults to user's timezone)
 * @returns {string} Formatted date string in local timezone
 */
export const formatDateTime = (dateString: string, format: string = 'MMM D, YYYY h:mm A', targetTimezone: string = userTimezone): string => {
  if (!dateString) return "N/A";
  // Parse the UTC date and convert to local timezone
  return dayjs.utc(dateString).tz(targetTimezone).format(format);
};
/**
 * Get relative time (e.g. "5 hours ago") for a UTC date string
 * @param {string} dateString - UTC date string from the backend
 * @param {string} [targetTimezone=userTimezone] - Target timezone (defaults to user's timezone)
 * @returns {string} Relative time string (e.g. "5 hours ago")
 */
export const getRelativeTime = (dateString: string, targetTimezone: string = userTimezone) => {
  if (!dateString) return "";
  // Parse as UTC, convert to local, then get relative time
  return dayjs.utc(dateString).tz(targetTimezone).fromNow();
};
/**
 * Calculate time interval between two UTC date strings
 * @param {string} startDateString - UTC start date string
 * @param {string} endDateString - UTC end date string
 * @param {string} [targetTimezone=userTimezone] - Target timezone (defaults to user's timezone)
 * @returns {string} Formatted time interval
 */
export const calculateTimeInterval = (startDateString: string, endDateString: string, targetTimezone: string = userTimezone): string => {
  if (!startDateString || !endDateString) return "";
  const start = dayjs.utc(startDateString).tz(targetTimezone);
  const end = dayjs.utc(endDateString).tz(targetTimezone);
  // Calculate the difference in minutes
  const diffMinutes = end.diff(start, 'minute');
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  }
  const diffHours = end.diff(start, 'hour');
  if (diffHours < 24) {
    const remainingMinutes = diffMinutes % 60;
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}` : ''}`;
  }
  const diffDays = end.diff(start, 'day');
  const remainingHours = diffHours % 24;
  return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}` : ''}`;
};
/**
 * Get the detected user timezone
 * @returns {string} User's timezone
 */
export const getUserTimezone = () => {
  return userTimezone;
};
/**
 * Check if a date is today
 * @param {string} dateString - UTC date string
 * @param {string} [targetTimezone=userTimezone] - Target timezone
 * @returns {boolean} True if the date is today in the target timezone
 */
export const isToday = (dateString: string, targetTimezone: string = userTimezone): boolean => {
  if (!dateString) return false;
  const date = dayjs.utc(dateString).tz(targetTimezone);
  const today = dayjs().tz(targetTimezone);
  return date.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
};
/**
 * Format a date with special handling for today's dates
 * @param {string} dateString - UTC date string
 * @param {string} [targetTimezone=userTimezone] - Target timezone
 * @returns {string} Formatted date with "Today" for today's dates
 */
export const formatDateTimeWithToday = (dateString: string, targetTimezone: string = userTimezone): string => {
  if (!dateString) return "N/A";
  if (isToday(dateString, targetTimezone)) {
    return `Today, ${dayjs.utc(dateString).tz(targetTimezone).format('h:mm A')}`;
  }
  return formatDateTime(dateString, 'MMM D, YYYY h:mm A', targetTimezone);
};






