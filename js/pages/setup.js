import { getYear, setYear } from '../state/year.js';

const setupView = document.getElementById('setup-view');
const appContent = document.getElementById('app-content');
const setupForm = document.getElementById('setup-form');
const yearInput = document.getElementById('accounting-year-input');

/**
 * Initializes the setup view logic.
 * If a year is already set, it shows the main app content.
 * Otherwise, it shows the setup view.
 * @param {function} onYearSet - Callback function to run after the year is set.
 */
export function initSetup(onYearSet) {
    const year = getYear();
    if (year) {
        showAppContent();
        onYearSet();
    } else {
        showSetupView();
    }

    setupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const selectedYear = yearInput.value;
        if (selectedYear && selectedYear.length === 4) {
            setYear(selectedYear);
            showAppContent();
            onYearSet();
        } else {
            alert('Indtast venligst et gyldigt årstal (f.eks. 2024).');
        }
    });
}

function showSetupView() {
    setupView.style.display = 'block';
    appContent.style.display = 'none';
}

function showAppContent() {
    setupView.style.display = 'none';
    appContent.style.display = 'block';
}
