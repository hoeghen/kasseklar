import { useState, useEffect, useCallback } from 'react';
import { addTransaction as dbAddTransaction, getAllTransactions as dbGetAllTransactions } from '../services/dbService';

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await dbGetAllTransactions();
            setTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshTransactions();
    }, [refreshTransactions]);

    const addTransaction = async (transaction) => {
        await dbAddTransaction(transaction);
        await refreshTransactions(); // Refresh the list after adding
    };

    return { transactions, addTransaction, loading };
};
