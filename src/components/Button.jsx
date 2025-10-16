import styled from 'styled-components';

export const Button = styled.button`
    background-color: var(--color-primary);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #0097a7;
    }
`;
