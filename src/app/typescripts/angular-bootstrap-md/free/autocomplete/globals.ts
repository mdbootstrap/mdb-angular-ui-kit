export const MAX_CHARS = 524288;  // the default max length per the html maxlength attribute
export const MIN_SEARCH_LENGTH = 3;
export const PAUSE = 100;
export const TEXT_SEARCHING = "Searching...";
export const TEXT_NO_RESULTS = "No results found";
export const CLEAR_TIMEOUT = 50;

export function isNil(value: string) {
    return typeof value === "undefined" || value === null;
};