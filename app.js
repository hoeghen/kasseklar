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

// IndexedDB setup
let db;
const request = indexedDB.open('bookkeepingDB', 1);

request.onupgradeneeded = event => {
    db = event.target.result;
    const objectStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('date', 'date', { unique: false });
    objectStore.createIndex('description', 'description', { unique: false });
    objectStore.createIndex('amount', 'amount', { unique: false });
    objectStore.createIndex('type', 'type', { unique: false }); // 'income' or 'expense'
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

transactionForm.addEventListener('submit', event => {
    event.preventDefault();
    const newTransaction = {
        date: document.getElementById('date').value,
        description: document.getElementById('description').value,
        amount: Number(document.getElementById('amount').value),
        type: document.getElementById('type').value
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
        displayTransactions();
    };
    tx.onerror = event => {
        console.error('Error adding transaction: ', event.target.errorCode);
    };
}

function displayTransactions() {
    transactionList.innerHTML = '';
    const store = db.transaction('transactions').objectStore('transactions');
    store.openCursor().onsuccess = event => {
        const cursor = event.target.result;
        if (cursor) {
            const li = document.createElement('li');
            li.textContent = `${cursor.value.date} - ${cursor.value.description} - ${cursor.value.amount} DKK (${cursor.value.type})`;
            transactionList.appendChild(li);
            cursor.continue();
        }
    };
}
