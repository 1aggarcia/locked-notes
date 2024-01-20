/** Service to help with the calculation and display of datetimes */

/**
 * Generate a timestamp a given number of seconds in the future
 * @param seconds the number of seconds from now to generate timestamp
 * @returns timestamp with given number of seconds from now
 */
export function calculateExpiryTime(seconds: number): Date {
    const msPerSec = 1000;
    const seconds_int = Math.floor(seconds);
    const timestamp = Date.now() + seconds_int * msPerSec;

    return new Date(timestamp);
}

/**
 * Convert timestamp in form of seconds since epoch to formatted datetime
 * @param seconds number of seconds since the epoch (1970-01-01 00:00:00)
 * @returns string representation of date
 */
export function formatDate(seconds: number) {
    const date = new Date(seconds);
    return date.toLocaleString(undefined, {
        day: 'numeric',
        year: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit'
    });
}

/**
 * Convert seconds to string representing MM:SS
 * @param seconds number of seconds to count.
 */
export function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const leftOver = Math.floor(seconds % 60);

    // account for leading zero
    if (leftOver < 10) {
        return `${minutes}:0${leftOver}`
    } else {
        return `${minutes}:${leftOver}`
    }
}

/**
 * Determine the number of seconds until the diven date
 * @param timestamp date and time to calculate the difference for
 * @returns number of seconds until given timestamp, or 0 if date is in the past.
 */
export function secondsUntil(timestamp: Date): number {
    const msPerSec = 1000;
    const difference = Math.floor((timestamp.getTime() - Date.now()) / msPerSec);

    return (difference > 0)? difference : 0
}
