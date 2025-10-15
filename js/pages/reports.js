import { kontoplan } from '../config.js';

const netBalanceEl = document.getElementById('net-balance');
const ledgerContainer = document.getElementById('ledger-container');

/**
 * Renders the reports page.
 * @param {Array<object>} transactions - All transactions.
 */
export function renderReportsPage(transactions) {
    displayNetBalance(transactions);
}

/**
 * Calculates and displays the net balance.
 * @param {Array<object>} transactions - All transactions.
 */
function displayNetBalance(transactions) {
    const netBalance = transactions.reduce((balance, tx) => {
        const account = kontoplan.find(acc => acc.number === tx.account);
        if (account?.type === 'income') return balance + tx.amount;
        if (account?.type === 'expense') return balance - tx.amount;
        return balance;
    }, 0);
    netBalanceEl.textContent = netBalance.toFixed(2);
}

/**
 * Renders the general ledger.
 * @param {Array<object>} transactions - All transactions.
 */
export function displayLedger(transactions) {
    ledgerContainer.innerHTML = '';
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date) || a.account - b.account);
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr><th>Dato</th><th>Beskrivelse</th><th>Konto</th><th>Beløb</th></tr>
        </thead>
        <tbody>
            ${transactions.map(tx => {
                const account = kontoplan.find(acc => acc.number === tx.account);
                return `<tr>
                    <td>${tx.date}</td>
                    <td>${tx.description}</td>
                    <td>${account ? `${account.number} - ${account.name}` : 'Ukendt'}</td>
                    <td>${tx.amount.toFixed(2)}</td>
                </tr>`;
            }).join('')}
        </tbody>
    `;
    ledgerContainer.appendChild(table);
}
