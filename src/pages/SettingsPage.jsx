import React, { useState } from 'react';
import styled from 'styled-components';
import { useTransactions } from '../hooks/useTransactions';
import { Button } from '../components/Button';
import { Toast } from '../components/Toast';

const SettingsContainer = styled.div`
    padding: 1rem;
`;

const Section = styled.section`
    margin-bottom: 2rem;
`;

export const SettingsPage = () => {
    const { transactions } = useTransactions();
    const [showToast, setShowToast] = useState(false);

    const handleExport = () => {
        const dataStr = JSON.stringify(transactions, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'KasseKlar_data.json';
        link.click();
        URL.revokeObjectURL(url);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
    };

    return (
        <SettingsContainer>
            <h2>Indstillinger</h2>
            <Section>
                <h3>Datastyring</h3>
                <Button onClick={handleExport}>Eksporter Alle Data (JSON)</Button>
            </Section>
            <Section>
                <h3>Tema</h3>
                <Button onClick={toggleTheme}>Skift Tema</Button>
            </Section>
            <Toast message="Data eksporteret!" show={showToast} />
        </SettingsContainer>
    );
};
