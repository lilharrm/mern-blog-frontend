import React from 'react';
import styles from './ClockContainer.module.scss';
import { useState, useEffect } from 'react';

import Clock from 'react-clock'
import 'react-clock/dist/Clock.css';

export const ClockContainer = () => {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => setValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const darkMode = window.localStorage.getItem("displayMode") || "light";
    const clockStyles = darkMode === "dark" ? `${styles.root} ${styles.root__dark}` : styles.root

    return <Clock value={value} className={clockStyles} />
}

export default ClockContainer;