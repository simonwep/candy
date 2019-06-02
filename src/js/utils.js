const config = require('../../config/config');
const fs = require('fs');

function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) events = [events];

    for (const element of elements) {
        for (const event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
module.exports.on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
module.exports.off = eventListener.bind(null, 'removeEventListener');

/**
 * Formats a date
 * @param format
 * @param date
 * @param locales
 * @returns {*}
 */
module.exports.formatDate = (format, date = Date.now(), locales = 'en-us') => {

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
};

/**
 * Formats a duration specified in seconds
 * @param duration
 * @returns {string}
 */
module.exports.formatSeconds = (duration = 0) => {
    const s = duration % 60;
    const m = Math.floor((duration / 60) % 60);
    const h = Math.floor((duration / 3600) % 3600);

    let res = '';

    if (h) {
        res += String(h).padStart(2, '0') + ':';
    }

    if (m || h) {
        res += String(m).padStart(2, '0') + ':';
    }

    if (s || m || h) {
        res += String(s).padStart(2, '0');
    }

    return res.length < 3 ? `${res || 0}s` : res;
};

/**
 * Convert a byte size to an human readable size.
 * e.g. 123456 => '123.46 kB'
 * @param bytes
 * @param mapValue Optional mapper to manipulate the raw number
 * @returns {string}
 */
module.exports.readableByteCount = (bytes, mapValue = v => v) => {
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
};

/**
 * Creates a uid
 * @returns {string}
 */
module.exports.createUID = () => {
    return Math.round(Math.random() * 1e15).toString(16) + Date.now().toString(16);
};

/**
 * Throttles the call of a function
 * @param fn
 * @param ms
 * @returns {Function}
 */
module.exports.throttleEvent = (fn, ms = 1000) => {
    let lastCall = 0;
    let timeout = 0;

    return (...args) => {

        clearTimeout(timeout);
        if (Date.now() - lastCall > ms) {
            lastCall = Date.now();
            fn(...args);
        } else {
            timeout = setTimeout(() => fn(...args), ms);
        }
    };
};

/**
 * Pick specific props from an object
 * @param object
 * @param props
 */
module.exports.pick = (object, props) => {
    const newObj = {};

    for (let i = 0, l = props.length; i < l; i++) {
        const prop = props[i];
        newObj[prop] = object[prop];
    }

    return newObj;
};

/**
 * Creates a directory if not already present. Uses the recursive method.
 * @param path The directory path, can be a tree
 * @returns {*} The input value
 */
module.exports.mkdirIfNotPresent = path => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, {recursive: true});
    }

    return path;
};

/**
 * Resolves and validates a youtube url / id or whatsoever
 * @param str
 * @returns {{playlistId: *, isValid: boolean, videoId: *, url: *}}
 */
module.exports.resolveYouTubeUrl = str => {
    str = str.trim();
    const strl = str.length;

    const match = (str, regex, g = 0) => {
        const m = str.match(regex);
        return m && m[g] ? m[g] : null;
    };

    const isId = str.match(/^[\w-]+$/);
    const playlistId = isId && strl > 30 ? str : match(str, /.*list=(.*?)(&|$)/, 1);
    const videoId = isId && strl <= 11 ? str : match(str, /(watch\?v=|youtu\.be\/)(.*?)(&|$)/, 2);
    const channelId = isId && (strl > 20 && strl < 30) ? str : match(str, /(channel|user)\/(.*?)(\/|&|$)/, 2);

    return {
        url: str,
        isValid: !!(playlistId || videoId || channelId),
        channelId,
        playlistId,
        videoId
    };
};

/**
 * Replaces invalid characters of a filename
 * @param str
 * @returns {*}
 */
module.exports.maskFilename = str => {
    return str.replace(/[/\\?%*:|"<>]/g, ' ').replace(/ +/g, ' ');
};
