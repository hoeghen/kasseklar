import React, { useState } from 'react';
import styled from 'styled-components';
import { useTransactions } from '../hooks/useTransactions';
import { useYear } from '../context/YearContext';
import { DatePicker } from '../components/DatePicker';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { kontoplan } from '../config';

const TransactionsContainer = styled.div`
    padding: 1rem;
`;

const TransactionForm = styled.form`
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
`;

const TransactionList = styled.ul`
    list-style: none;
    padding: 0;
`;

const TransactionItem = styled.li`
    padding: 10px;
    border-bottom: 1px solid var(--color-border);
`;

const EmptyState = styled.p`
    text-align: center;
    color: #888;
`;

export const TransactionsPage = () => {
    const { transactions, addTransaction, loading } = useTransactions();
    const { year } = useYear();

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [account, setAccount] = useState('');
    const [selectedDate, setSelectedDate] = useState({
        day: new Date().getDate(),
        month: new Date().getMonth() + 1
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || !account) {
            alert('Udfyld venligst alle felter.');
            return;
        }

        const dateStr = `${year}-${String(selectedDate.month).padStart(2, '0')}-${String(selectedDate.day).padStart(2, '0')}`;

        await addTransaction({
            date: dateStr,
            description,
            amount: parseFloat(amount),
            account: parseInt(account)
        });

        // Reset form
        setDescription('');
        setAmount('');
        setAccount('');
    };

    return (
        <TransactionsContainer>
            <h2>Tilføj ny transaktion</h2>
            <TransactionForm onSubmit={handleSubmit}>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Beløb" step="0.01" required />
                <Input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Beskrivelse" required />
                <DatePicker onDateSelected={setSelectedDate} />
                <Select value={account} onChange={e => setAccount(e.target.value)} required>
                    <option value="" disabled>Vælg konto</option>
                    {kontoplan.map(acc => (
                        <option key={acc.number} value={acc.number}>
                            {acc.number} - {acc.name}
                        </option>
                    ))}
                </Select>
                <Button type="submit">Tilføj</Button>
            </TransactionForm>

            <h2>Transaktioner</h2>
            {loading ? <p>Indlæser...</p> : (
                <TransactionList>
                    {transactions.length === 0 ? (
                        <EmptyState>Du har endnu ingen transaktioner. Tilføj din første!</EmptyState>
                    ) : (
                        transactions.map(tx => (
                            <TransactionItem key={tx.id}>
                                {tx.date}: {tx.description} - {tx.amount.toFixed(2)} DKK
                            </TransactionItem>
                        ))
                    )}
                </TransactionList>
            )}
        </TransactionsContainer>
    );
};
