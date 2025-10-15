if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}

const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidenav = document.getElementById('sidenav');
const main = document.querySelector('main');

menuBtn.addEventListener('click', () => {
    sidenav.style.width = '250px';
    main.style.marginLeft = '250px';
});

closeBtn.addEventListener('click', () => {
    sidenav.style.width = '0';
    main.style.marginLeft = '0';
});

// View Switching Logic
const views = {
    transactions: document.getElementById('transactions-view'),
    reports: document.getElementById('reports-view'),
    settings: document.getElementById('settings-view'),
};

const navLinks = {
    transactions: document.querySelector('#sidenav a[href="#Transaktioner"]'),
    reports: document.querySelector('#sidenav a[href="#Rapporter"]'),
    settings: document.querySelector('#sidenav a[href="#Indstillinger"]'),
};

function showView(viewName) {
    Object.values(views).forEach(view => view.style.display = 'none');
    views[viewName].style.display = 'block';
    // Special actions when a view is shown
    if (viewName === 'reports') {
        calculateNetBalance();
    }
    // Close the sidenav
    sidenav.style.width = '0';
    main.style.marginLeft = '0';
}

navLinks.transactions.addEventListener('click', () => showView('transactions'));
navLinks.reports.addEventListener('click', () => showView('reports'));
navLinks.settings.addEventListener('click', () => showView('settings'));

const kontoplan = [
    // Indtægter (Income)
    { number: 1100, name: 'Salg af varer', type: 'income' },
    { number: 1200, name: 'Salg af ydelser', type: 'income' },
    // Udgifter (Expenses)
    { number: 2100, name: 'Varekøb', type: 'expense' },
    { number: 2200, name: 'Lokaleomkostninger', type: 'expense' },
    { number: 2300, name: 'Kontorartikler', type: 'expense' },
    { number: 2400, name: 'Småanskaffelser', type: 'expense' },
    // Aktiver (Assets)
    { number: 5500, name: 'Bank', type: 'asset' },
    { number: 5600, name: 'Kasse', type: 'asset' },
    // Passiver (Liabilities)
    { number: 5800, name: 'Egenkapital', type: 'liability' },
];

// IndexedDB setup
let db;
const request = indexedDB.open('bookkeepingDB', 2);

request.onupgradeneeded = event => {
    db = event.target.result;
    let objectStore;

    // Check if the object store already exists
    if (!db.objectStoreNames.contains('transactions')) {
        objectStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
    } else {
        objectStore = event.target.transaction.objectStore('transactions');
    }

    // Now, safely add or remove indexes
    if (!objectStore.indexNames.contains('date')) {
        objectStore.createIndex('date', 'date', { unique: false });
    }
    if (!objectStore.indexNames.contains('description')) {
        objectStore.createIndex('description', 'description', { unique: false });
    }
    if (!objectStore.indexNames.contains('amount')) {
        objectStore.createIndex('amount', 'amount', { unique: false });
    }
    if (objectStore.indexNames.contains('type')) {
        objectStore.deleteIndex('type');
    }
    if (!objectStore.indexNames.contains('account')) {
        objectStore.createIndex('account', 'account', { unique: false });
    }
};

request.onsuccess = event => {
    db = event.target.result;
    console.log('Database opened successfully');
    displayTransactions();
};

request.onerror = event => {
    console.error('Database error: ', event.target.errorCode);
};

// Transaction form handling
const transactionForm = document.getElementById('transaction-form');
const transactionList = document.getElementById('transaction-list');
const accountDropdown = document.getElementById('account');
const dateInput = document.getElementById('date');

// Populate account dropdown and set default date
window.addEventListener('DOMContentLoaded', () => {
    kontoplan.forEach(account => {
        const option = document.createElement('option');
        option.value = account.number;
        option.textContent = `${account.number} - ${account.name}`;
        accountDropdown.appendChild(option);
    });
    dateInput.valueAsDate = new Date();
});

transactionForm.addEventListener('submit', event => {
    event.preventDefault();
    const newTransaction = {
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        amount: Number(document.getElementById('amount').value),
        account: Number(document.getElementById('account').value)
    };
    addTransaction(newTransaction);
});

function addTransaction(transaction) {
    const tx = db.transaction('transactions', 'readwrite');
    const store = tx.objectStore('transactions');
    store.add(transaction);
    tx.oncomplete = () => {
        console.log('Transaction added successfully');
        transactionForm.reset();
        dateInput.valueAsDate = new Date(); // Reset date to today
        displayTransactions();
    };
    tx.onerror = event => {
        console.error('Error adding transaction: ', event.target.errorCode);
    };
}

// Reports Logic
const netBalanceEl = document.getElementById('net-balance');
const generateLedgerBtn = document.getElementById('generate-ledger-btn');
const ledgerContainer = document.getElementById('ledger-container');

function calculateNetBalance() {
    let totalIncome = 0;
    let totalExpense = 0;

    const store = db.transaction('transactions').objectStore('transactions');
    store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            const account = kontoplan.find(acc => acc.number === cursor.value.account);
            if (account) {
                if (account.type === 'income') {
                    totalIncome += cursor.value.amount;
                } else if (account.type === 'expense') {
                    totalExpense += cursor.value.amount;
                }
            }
            cursor.continue();
        } else {
            const netBalance = totalIncome - totalExpense;
            netBalanceEl.textContent = netBalance.toFixed(2);
        }
    };
}

function generateLedger() {
    ledgerContainer.innerHTML = '';
    const store = db.transaction('transactions').objectStore('transactions');
    const transactions = [];

    store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            transactions.push(cursor.value);
            cursor.continue();
        } else {
            // Sort transactions by date, then by account number
            transactions.sort((a, b) => {
                if (a.date < b.date) return -1;
                if (a.date > b.date) return 1;
                if (a.account < b.account) return -1;
                if (a.account > b.account) return 1;
                return 0;
            });

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Dato</th>
                        <th>Beskrivelse</th>
                        <th>Konto</th>
                        <th>Beløb</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactions.map(tx => {
                        const account = kontoplan.find(acc => acc.number === tx.account);
                        return `
                            <tr>
                                <td>${tx.date}</td>
                                <td>${tx.description}</td>
                                <td>${account ? `${account.number} - ${account.name}` : 'Ukendt'}</td>
                                <td>${tx.amount.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            `;
            ledgerContainer.appendChild(table);
        }
    };
}

generateLedgerBtn.addEventListener('click', generateLedger);

// Settings Logic
const exportDataBtn = document.getElementById('export-data-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function exportDataToJson() {
    const store = db.transaction('transactions').objectStore('transactions');
    const transactions = [];

    store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            transactions.push(cursor.value);
            cursor.continue();
        } else {
            const dataStr = JSON.stringify(transactions, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'KasseKlar_data.json';
            link.click();
            URL.revokeObjectURL(url);
        }
    };
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkMode = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDarkMode ? 'Skift til Lys Tilstand' : 'Skift til Mørk Tilstand';
}

exportDataBtn.addEventListener('click', exportDataToJson);
themeToggleBtn.addEventListener('click', toggleTheme);

function displayTransactions() {
    transactionList.innerHTML = '';
    const store = db.transaction('transactions').objectStore('transactions');
    store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            const account = kontoplan.find(acc => acc.number === cursor.value.account);
            const accountText = account ? `${account.number} - ${account.name}` : 'Ukendt konto';

            const li = document.createElement('li');
            li.textContent = `${cursor.value.date} - ${cursor.value.description} - ${cursor.value.amount.toFixed(2)} DKK (Konto: ${accountText})`;
            transactionList.appendChild(li);
            cursor.continue();
        }
    };
}
