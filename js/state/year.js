const YEAR_KEY = 'kasseklar_accounting_year';

/**
 * Gets the currently selected accounting year from localStorage.
 * @returns {string | null} The accounting year, or null if not set.
 */
export function getYear() {
    return localStorage.getItem(YEAR_KEY);
}

/**
 * Sets the accounting year in localStorage.
 * @param {string} year - The accounting year to set.
 */
export function setYear(year) {
    localStorage.setItem(YEAR_KEY, year);
}
