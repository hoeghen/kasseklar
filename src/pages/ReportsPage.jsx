import React from 'react';
import styled from 'styled-components';
import { useTransactions } from '../hooks/useTransactions';
import { kontoplan } from '../config';

const ReportsContainer = styled.div`
    padding: 1rem;
`;

const NetBalance = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
`;

const LedgerTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    th, td {
        border-bottom: 1px solid var(--color-border);
        padding: 8px;
        text-align: left;
    }

    th {
        font-weight: bold;
    }
`;

export const ReportsPage = () => {
    const { transactions, loading } = useTransactions();

    const netBalance = transactions.reduce((balance, tx) => {
        const account = kontoplan.find(acc => acc.number === tx.account);
        if (account?.type === 'income') return balance + tx.amount;
        if (account?.type === 'expense') return balance - tx.amount;
        return balance;
    }, 0);

    const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
        <ReportsContainer>
            <h2>Rapporter</h2>
            {loading ? <p>Indlæser...</p> : (
                <>
                    <h3>Nettobalance</h3>
                    <NetBalance>{netBalance.toFixed(2)} DKK</NetBalance>

                    <h3>Hovedbog</h3>
                    <LedgerTable>
                        <thead>
                            <tr>
                                <th>Dato</th>
                                <th>Beskrivelse</th>
                                <th>Konto</th>
                                <th>Beløb</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map(tx => {
                                const account = kontoplan.find(acc => acc.number === tx.account);
                                return (
                                    <tr key={tx.id}>
                                        <td>{tx.date}</td>
                                        <td>{tx.description}</td>
                                        <td>{account ? `${account.number} - ${account.name}` : 'Ukendt'}</td>
                                        <td>{tx.amount.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </LedgerTable>
                </>
            )}
        </ReportsContainer>
    );
};
