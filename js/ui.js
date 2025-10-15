// DOM Element References
const views = {
    transactions: document.getElementById('transactions-view'),
    reports: document.getElementById('reports-view'),
    settings: document.getElementById('settings-view'),
};
const sidenav = document.getElementById('sidenav');
const main = document.querySelector('main');

/**
 * Initializes the main UI event listeners for navigation.
 * @param {object} handlers - An object containing handler functions for view changes.
 */
export function initUI(handlers) {
    document.getElementById('menu-btn').addEventListener('click', () => {
        sidenav.style.width = '250px';
    });
    document.getElementById('close-btn').addEventListener('click', () => {
        sidenav.style.width = '0';
    });
    document.querySelector('#sidenav a[href="#Transaktioner"]').addEventListener('click', () => showView('transactions', handlers.onShowTransactions));
    document.querySelector('#sidenav a[href="#Rapporter"]').addEventListener('click', () => showView('reports', handlers.onShowReports));
    document.querySelector('#sidenav a[href="#Indstillinger"]').addEventListener('click', () => showView('settings', handlers.onShowSettings));
}

/**
 * Shows a specific view and hides others.
 * @param {string} viewName - The name of the view to show.
 * @param {function} viewInitFunction - The function to call to initialize the view.
 */
function showView(viewName, viewInitFunction) {
    Object.values(views).forEach(view => view.style.display = 'none');
    views[viewName].style.display = 'block';

    if (viewInitFunction) {
        viewInitFunction();
    }

    sidenav.style.width = '0';
    main.style.marginLeft = '0';
}
