import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

// Initialize dayjs plugins
dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);

interface DateTimeFormatOptions {
    showDate?: boolean;
    showTime?: boolean;
    showSeconds?: boolean;
    dateFormat?: string;
    timeFormat?: string;
    fullDateTimeFormat?: string;
}

/**
 * Convert UTC date/time to local timezone
 * @param dateTime - UTC date/time string or Date object
 * @param options - Formatting options
 * @returns Formatted date/time string in local timezone
 */
export const formatToLocalTimezone = (
    dateTime: string | Date | null | undefined,
    options: DateTimeFormatOptions = {}
): string => {
    if (!dateTime) {
        return 'N/A';
    }

    const {
        showDate = true,
        showTime = true,
        showSeconds = false,
        dateFormat = 'MMM D, YYYY', // e.g., "Jan 1, 2023"
        timeFormat = showSeconds ? 'h:mm:ss A' : 'h:mm A', // e.g., "3:30 PM" or "3:30:45 PM"
        fullDateTimeFormat = `${dateFormat} ${timeFormat}` // e.g., "Jan 1, 2023 3:30 PM"
    } = options;

    try {
        const localDateTime = dayjs.utc(dateTime).local();

        // Return based on options
        if (showDate && showTime) {
            return localDateTime.format(fullDateTimeFormat);
        } else if (showDate) {
            return localDateTime.format(dateFormat);
        } else if (showTime) {
            return localDateTime.format(timeFormat);
        } else {
            return localDateTime.format(fullDateTimeFormat); // Default to full format
        }
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

/**
 * Get the local timezone name
 * @returns The local timezone name (e.g., "America/New_York")
 */
export const getLocalTimezoneName = (): string => {
    return dayjs.tz.guess();
};

/**
 * Format a date range (start and end dates) in local timezone
 * @param startDate - UTC start date/time
 * @param endDate - UTC end date/time
 * @param options - Formatting options
 * @returns Formatted date range string
 */
export const formatDateRange = (
    startDate: string | Date | null | undefined,
    endDate: string | Date | null | undefined,
    options: DateTimeFormatOptions = {}
): string => {
    if (!startDate && !endDate) {
        return 'N/A';
    }

    const start = startDate ? formatToLocalTimezone(startDate, options) : 'N/A';
    const end = endDate ? formatToLocalTimezone(endDate, options) : 'N/A';

    return `${start} - ${end}`;
};

/**
 * Get relative time description (e.g., "2 hours ago", "in 3 days")
 * @param dateTime - UTC date/time string or Date object
 * @returns Relative time description string
 */
export const getRelativeTime = (dateTime: string | Date | null | undefined): string => {
    if (!dateTime) {
        return 'N/A';
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        return localDateTime.fromNow();
    } catch (error) {
        console.error('Error getting relative time:', error);
        return 'Invalid date';
    }
};

/**
 * Check if a date is today in local timezone
 * @param dateTime - UTC date/time string or Date object
 * @returns Boolean indicating if the date is today
 */
export const isToday = (dateTime: string | Date | null | undefined): boolean => {
    if (!dateTime) {
        return false;
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        const today = dayjs();
        return localDateTime.format('YYYY-MM-DD') === today.format('YYYY-MM-DD');
    } catch {
        return false;
    }
};

/**
 * Extract only the date part from a UTC datetime in local timezone
 * @param dateTime - UTC date/time string or Date object
 * @param format - Optional custom date format (default 'MMM D, YYYY')
 * @returns Formatted date string in local timezone
 */
export const getLocalDate = (
    dateTime: string | Date | null | undefined,
    format: string = 'MMM D, YYYY'
): string => {
    if (!dateTime) {
        return 'N/A';
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        return localDateTime.format(format);
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid date';
    }
};

/**
 * Extract only the time part from a UTC datetime in local timezone
 * @param dateTime - UTC date/time string or Date object
 * @param showSeconds - Whether to include seconds in the time format
 * @param format - Optional custom time format (overrides showSeconds option)
 * @returns Formatted time string in local timezone
 */
export const getLocalTime = (
    dateTime: string | Date | null | undefined,
    showSeconds: boolean = false,
    format?: string
): string => {
    if (!dateTime) {
        return 'N/A';
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        // If custom format is provided, use it; otherwise use default based on showSeconds
        const timeFormat = format || (showSeconds ? 'h:mm:ss A' : 'h:mm A');
        return localDateTime.format(timeFormat);
    } catch (error) {
        console.error('Error formatting time:', error);
        return 'Invalid time';
    }
};

/**
 * Split a UTC datetime into separate date and time components
 * @param dateTime - UTC date/time string or Date object
 * @param dateFormat - Format for the date part
 * @param timeFormat - Format for the time part
 * @returns Object with date and time strings or null if input is invalid
 */
export const splitDateTime = (
    dateTime: string | Date | null | undefined,
    dateFormat: string = 'MMM D, YYYY',
    timeFormat: string = 'h:mm A'
): { date: string; time: string } | null => {
    if (!dateTime) {
        return null;
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        return {
            date: localDateTime.format(dateFormat),
            time: localDateTime.format(timeFormat)
        };
    } catch (error) {
        console.error('Error splitting date/time:', error);
        return null;
    }
};

/**
 * Format date to ISO format (YYYY-MM-DD) in local timezone
 * Useful for date inputs in forms
 * @param dateTime - UTC date/time string or Date object
 * @returns ISO formatted date string
 */
export const toLocalISODate = (
    dateTime: string | Date | null | undefined
): string => {
    if (!dateTime) {
        return '';
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        return localDateTime.format('YYYY-MM-DD');
    } catch (error) {
        console.error('Error formatting ISO date:', error);
        return '';
    }
};

/**
 * Format time to HH:MM or HH:MM:SS format in local timezone
 * Useful for time inputs in forms
 * @param dateTime - UTC date/time string or Date object
 * @param includeSeconds - Whether to include seconds
 * @returns Formatted time string for use in time inputs
 */
export const toLocalInputTimeFormat = (
    dateTime: string | Date | null | undefined,
    includeSeconds: boolean = false
): string => {
    if (!dateTime) {
        return '';
    }

    try {
        const localDateTime = dayjs.utc(dateTime).local();
        return localDateTime.format(includeSeconds ? 'HH:mm:ss' : 'HH:mm');
    } catch (error) {
        console.error('Error formatting input time:', error);
        return '';
    }
};