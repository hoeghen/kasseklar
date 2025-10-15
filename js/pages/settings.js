const themeToggleBtn = document.getElementById('theme-toggle-btn');

/**
 * Initializes the settings page.
 * @param {object} handlers - Event handlers for the page.
 */
export function initSettingsPage(handlers) {
    document.getElementById('export-data-btn').addEventListener('click', handlers.onExportData);
    themeToggleBtn.addEventListener('click', toggleTheme);
}

/**
 * Toggles the dark/light theme.
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkMode = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDarkMode ? 'Skift til Lys Tilstand' : 'Skift til Mørk Tilstand';
}
