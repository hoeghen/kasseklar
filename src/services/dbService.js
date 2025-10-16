const DB_NAME = 'kasseklar_react_db';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

let db;

function initDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = event => {
            const dbInstance = event.target.result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                objectStore.createIndex('date', 'date', { unique: false });
            }
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

export async function addTransaction(transaction) {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.add(transaction);
        tx.oncomplete = () => {
            resolve();
        };
        tx.onerror = event => {
            reject(event.target.errorCode);
        };
    });
}

export async function getAllTransactions() {
    const db = await initDB();
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
            reject(event.target.errorCode);
        };
    });
}
