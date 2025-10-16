import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Button } from './Button';

const DatePickerTrigger = styled.div`
    padding: 10px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    background-color: var(--color-background);
    margin-bottom: 10px;
    border-radius: 5px;
    text-align: left;
`;

const Modal = styled.div`
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background-color: var(--color-background-offset);
    padding: 20px;
    border-radius: 5px;
    width: 90%;
    max-width: 300px;
`;

const DatePickerContainer = styled.div`
    display: flex;
    justify-content: space-around;
    height: 200px;
    overflow-y: hidden;
`;

const DatePickerColumn = styled.div`
    width: 45%;
    overflow-y: scroll;
    text-align: center;
`;

const DatePickerItem = styled.div`
    padding: 10px;
    cursor: pointer;
    border-radius: 50%;

    &.selected {
        background-color: var(--color-primary);
        color: white;
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    gap: 10px;
`;

const months = [
    'Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'December'
];

export const DatePicker = ({ onDateSelected }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

    const daysInMonth = useMemo(() => {
        return new Date(2024, selectedMonth, 0).getDate(); // Use a leap year for Feb
    }, [selectedMonth]);

    const handleConfirm = () => {
        if (selectedDay > daysInMonth) {
            alert(`Ugyldig dato. ${months[selectedMonth - 1]} har kun ${daysInMonth} dage.`);
            return;
        }
        onDateSelected({ day: selectedDay, month: selectedMonth });
        setIsOpen(false);
    };

    const renderDays = () => {
        const days = [];
        for (let i = 1; i <= 31; i++) {
            days.push(
                <DatePickerItem
                    key={i}
                    className={selectedDay === i ? 'selected' : ''}
                    onClick={() => setSelectedDay(i)}
                >
                    {String(i).padStart(2, '0')}
                </DatePickerItem>
            );
        }
        return days;
    };

    const renderMonths = () => {
        return months.map((month, index) => (
            <DatePickerItem
                key={index + 1}
                className={selectedMonth === index + 1 ? 'selected' : ''}
                onClick={() => setSelectedMonth(index + 1)}
            >
                {String(index + 1).padStart(2, '0')} {month}
            </DatePickerItem>
        ));
    };

    return (
        <>
            <DatePickerTrigger onClick={() => setIsOpen(true)}>
                Dato: {String(selectedDay).padStart(2, '0')}-{String(selectedMonth).padStart(2, '0')}
            </DatePickerTrigger>
            {isOpen && (
                <Modal>
                    <ModalContent>
                        <DatePickerContainer>
                            <DatePickerColumn>{renderDays()}</DatePickerColumn>
                            <DatePickerColumn>{renderMonths()}</DatePickerColumn>
                        </DatePickerContainer>
                        <ModalActions>
                            <Button onClick={() => setIsOpen(false)}>Annuller</Button>
                            <Button onClick={handleConfirm}>OK</Button>
                        </ModalActions>
                    </ModalContent>
                </Modal>
            )}
        </>
    );
};
