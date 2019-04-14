import config from '../../config/config';

/**
 * Formats a date
 * @param format
 * @param date
 * @param locales
 * @returns {*}
 */
export function formatDate(format, date = Date.now(), locales = 'en-us') {

    if (typeof date === 'number') {
        date = new Date(date);
    }

    // Validate date
    if (!(date instanceof Date) || isNaN(date)) {
        return 'Invalid date';
    }

    const pad = (v, a = 2) => String(v).padStart(a, '0');
    const getLocal = (name, type) => date.toLocaleString(locales, {[name]: type});

    const strMap = {
        'HH': pad(date.getHours()),
        'mm': pad(date.getMinutes()),
        'ss': pad(date.getSeconds()),
        'x': date.getTime(),
        'SSS': pad(date.getMilliseconds(), 4),
        'YYYY': pad(date.getFullYear(), 4),
        'MMMM': getLocal('month', 'long'),
        'MMM': getLocal('month', 'short'),
        'MM': pad(date.getMonth()),
        'M': getLocal('month', 'narrow'),
        'DDDD': getLocal('weekday', 'long'),
        'DDD': getLocal('weekday', 'short'),
        'DD': pad(date.getDate()),
        'D': getLocal('weekday', 'narrow')
    };

    return format.replace(
        new RegExp(Object.keys(strMap).join('|'), 'g'),
        match => strMap[match] || ''
    );
}

/**
 * Formats a duration specified in seconds
 * @param duration
 * @returns {string}
 */
export function formatSeconds(duration = 0) {
    return [
        Math.floor(duration / 3600),
        Math.floor(duration / 60),
        duration % 60
    ].map(v => v ? String(v).padStart(2, '0') : 0).filter(Boolean).join(':');
}

/**
 * Convert a byte size to an human readable size.
 * e.g. 123456 => '123.46 kB'
 * @param bytes
 * @param mapValue Optional mapper to manipulate the raw number
 * @returns {string}
 */
export function readableByteCount(bytes, mapValue = v => v) {
    const si = config.binaryPrefix;
    const unit = si ? 1000 : 1024;
    const block = bytes / unit;

    if (block < 1) {
        return `${bytes} B`;
    }

    for (let i = 1; i <= 6; i++) {
        if (block < Math.pow(unit, i)) {
            const size = Number((block / Math.pow(unit, i - 1)).toFixed(2));
            const desc = ' ' + (si ? 'kMGTPEB' : 'kMGTPEiB').charAt(i - 1) + (si ? '' : 'i') + 'B';
            return mapValue(size) + desc;
        }
    }

    return `${bytes} B`;
}

/**
 * Creates a uid
 * @returns {string}
 */
export function createUID() {
    return Math.round(Math.random() * 1e15).toString(16) + Date.now().toString(16);
}

/**
 * Throttles the call of a function
 * @param fn
 * @param ms
 * @returns {Function}
 */
export function throttleEvent(fn, ms = 1000) {
    let lastCall = 0;
    let timeout = 0;

    return () => {

        clearTimeout(timeout);
        if (Date.now() - lastCall > ms) {
            lastCall = Date.now();
            fn();
        }

        timeout = setTimeout(() => fn(), ms);
    };
}
