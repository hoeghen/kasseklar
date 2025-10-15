let db;

const DB_NAME = 'bookkeepingDB';
const DB_VERSION = 2;
const STORE_NAME = 'transactions';

/**
 * Initializes the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database object.
 */
export function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            const dbInstance = event.target.result;
            let objectStore;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            } else {
                objectStore = event.target.transaction.objectStore(STORE_NAME);
            }

            if (!objectStore.indexNames.contains('date')) objectStore.createIndex('date', 'date', { unique: false });
            if (!objectStore.indexNames.contains('description')) objectStore.createIndex('description', 'description', { unique: false });
            if (!objectStore.indexNames.contains('amount')) objectStore.createIndex('amount', 'amount', { unique: false });
            if (!objectStore.indexNames.contains('account')) objectStore.createIndex('account', 'account', { unique: false });
        };

        request.onsuccess = event => {
            db = event.target.result;
            console.log('Database initialized successfully');
            resolve(db);
        };

        request.onerror = event => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Adds a new transaction to the database.
 * @param {object} transaction - The transaction object to add.
 * @returns {Promise<void>} A promise that resolves when the transaction is added.
 */
export function addTransaction(transaction) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.add(transaction);
        tx.oncomplete = () => {
            resolve();
        };
        tx.onerror = event => {
            console.error('Error adding transaction:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

/**
 * Retrieves all transactions from the database.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of all transactions.
 */
export function getAllTransactions() {
    return new Promise((resolve, reject) => {
        const store = db.transaction(STORE_NAME).objectStore(STORE_NAME);
        const transactions = [];
        const request = store.openCursor();

        request.onsuccess = event => {
            const cursor = event.target.result;
            if (cursor) {
                transactions.push(cursor.value);
                cursor.continue();
            } else {
                resolve(transactions);
            }
        };
        request.onerror = event => {
            console.error('Error fetching transactions:', event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}
