import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { YearContext } from '../context/YearContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

const SetupContainer = styled.div`
    padding: 2rem;
    text-align: center;
`;

export const SetupPage = () => {
    const { selectYear } = useContext(YearContext);
    const [yearInput, setYearInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (yearInput && yearInput.length === 4) {
            selectYear(yearInput);
        } else {
            alert('Indtast venligst et gyldigt årstal (f.eks. 2024).');
        }
    };

    return (
        <SetupContainer>
            <h2>Velkommen til KasseKlar</h2>
            <p>Vælg venligst dit regnskabsår for at fortsætte.</p>
            <form onSubmit={handleSubmit}>
                <Input
                    type="number"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
                    placeholder="f.eks. 2024"
                />
                <Button type="submit">Start</Button>
            </form>
        </SetupContainer>
    );
};
