import { kontoplan } from '../config.js';
import { initDatePicker } from '../components/datePicker.js';

const transactionList = document.getElementById('transaction-list');
const accountDropdown = document.getElementById('account');

let selectedDate = null;

/**
 * Initializes the transactions page.
 */
export function initTransactionsPage() {
    populateAccountDropdown();
    initDatePicker((date) => {
        selectedDate = date;
    });
}

/**
 * Populates the account dropdown menu.
 */
function populateAccountDropdown() {
    // Clear existing options except the first disabled one
    while (accountDropdown.options.length > 1) {
        accountDropdown.remove(1);
    }

    kontoplan.forEach(account => {
        const option = document.createElement('option');
        option.value = account.number;
        option.textContent = `${account.number} - ${account.name}`;
        accountDropdown.appendChild(option);
    });
}

/**
 * Displays transactions in the list.
 * @param {Array<object>} transactions - The transactions to display.
 */
export function displayTransactions(transactions) {
    transactionList.innerHTML = '';
    transactions.forEach(tx => {
        const account = kontoplan.find(acc => acc.number === tx.account);
        const accountText = account ? `${account.number} - ${account.name}` : 'Ukendt konto';
        const li = document.createElement('li');
        li.textContent = `${tx.date} - ${tx.description} - ${tx.amount.toFixed(2)} DKK (Konto: ${accountText})`;
        transactionList.appendChild(li);
    });
}

/**
 * Gets the currently selected date from the date picker.
 * @returns {object | null} The selected date.
 */
export function getSelectedDate() {
    return selectedDate;
}
