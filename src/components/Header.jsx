import React, { useContext } from 'react';
import styled from 'styled-components';
import { YearContext } from '../context/YearContext';

const HeaderContainer = styled.header`
    background-color: var(--color-background-offset);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
`;

const Title = styled.h1`
    margin: 0;
    font-size: 1.5rem;
`;

const YearDisplay = styled.span`
    font-size: 1rem;
    font-weight: bold;
`;

export const Header = () => {
    const { year } = useContext(YearContext);

    return (
        <HeaderContainer>
            <Title>KasseKlar</Title>
            {year && <YearDisplay>Regnskabsår: {year}</YearDisplay>}
        </HeaderContainer>
    );
};
