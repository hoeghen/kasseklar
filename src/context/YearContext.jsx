import React, { createContext, useState, useContext } from 'react';

const YEAR_KEY = 'kasseklar_accounting_year';

export const YearContext = createContext();

export const YearProvider = ({ children }) => {
    const [year, setYear] = useState(() => localStorage.getItem(YEAR_KEY));

    const selectYear = (newYear) => {
        localStorage.setItem(YEAR_KEY, newYear);
        setYear(newYear);
    };

    return (
        <YearContext.Provider value={{ year, selectYear }}>
            {children}
        </YearContext.Provider>
    );
};
