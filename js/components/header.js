import { getYear } from '../state/year.js';

const yearDisplay = document.getElementById('accounting-year-display');

/**
 * Renders the header component, displaying the current accounting year.
 */
export function renderHeader() {
    const year = getYear();
    if (year) {
        yearDisplay.textContent = `Regnskabsår: ${year}`;
    }
}
