import { initDB, addTransaction, getAllTransactions } from './storage.js';
import { initUI } from './ui.js';
import { initSetup } from './pages/setup.js';
import { renderHeader } from './components/header.js';
import { initTransactionsPage, displayTransactions, getSelectedDate } from './pages/transactions.js';
import { renderReportsPage, displayLedger } from './pages/reports.js';
import { initSettingsPage } from './pages/settings.js';
import { getYear } from './state/year.js';

document.addEventListener('DOMContentLoaded', () => {
    initSetup(initializeApp);
});

async function initializeApp() {
    try {
        renderHeader();
        await initDB();

        initTransactionsPage();

        const handlers = {
            onShowTransactions: refreshTransactionList,
            onShowReports: refreshReports,
            onShowSettings: () => initSettingsPage({ onExportData: handleExportData }),
            onAddTransaction: handleAddTransaction,
            onGenerateLedger: handleGenerateLedger,
        };

        initUI(handlers);

        // Add event listeners that are not tied to a specific view's init
        document.getElementById('transaction-form').addEventListener('submit', handleAddTransaction);
        document.getElementById('generate-ledger-btn').addEventListener('click', handleGenerateLedger);

        refreshTransactionList(); // Show initial view

    } catch (error) {
        console.error('Application failed to initialize:', error);
    }
}

async function refreshTransactionList() {
    const transactions = await getAllTransactions();
    displayTransactions(transactions);
}

async function handleAddTransaction(event) {
    event.preventDefault();
    const form = event.target;
    const selectedDate = getSelectedDate();
    const year = getYear();

    if (!selectedDate || !year) {
        alert('Vælg venligst en dato.');
        return;
    }

    const dateStr = `${year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;

    const newTransaction = {
        date: dateStr,
        description: form.querySelector('#description').value,
        amount: Number(form.querySelector('#amount').value),
        account: Number(form.querySelector('#account').value)
    };

    await addTransaction(newTransaction);
    form.reset();
    // The date picker's internal state will reset itself via its own logic
    // No need to re-initialize the entire page here, which caused the memory leak.
    refreshTransactionList();
}

async function refreshReports() {
    const transactions = await getAllTransactions();
    renderReportsPage(transactions);
}

async function handleGenerateLedger() {
    const transactions = await getAllTransactions();
    displayLedger(transactions);
}

async function handleExportData() {
    const transactions = await getAllTransactions();
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'KasseKlar_data.json';
    link.click();
    URL.revokeObjectURL(url);
}
