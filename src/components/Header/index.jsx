import React from 'react';
import { Link } from 'react-router-dom';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import styles from './Header.module.scss';

import logoSvg from '../../assets/img/etanetas_logo.svg';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuth } from '../../redux/slices/auth';

export const Header = (props) => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    // if (window.confirm('Ar tikrai norite išeiti:?')) {
    dispatch(logout());
    window.localStorage.removeItem('token');
    // }
  };

  const toggleDisplayMode = () => {
    if (props.displayMode === "light") {
      props.setDisplayMode("dark")
      window.localStorage.setItem("displayMode", "dark")
    }
    else {
      props.setDisplayMode("light")
      window.localStorage.setItem("displayMode", "light")
    }
  }

  const containerStyles = props.displayMode === 'dark' ?  `${styles.root} ${styles.root__darkMode}` : styles.root;

  return (
    <div className={containerStyles}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <img src={logoSvg} alt="Etanetas" />
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Sukurti įrašą</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Atsijungti
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Prisijungti</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Registracija</Button>
                </Link>
              </>
            )}
            <IconButton color="primary" onClick={toggleDisplayMode}>
              {props.displayMode === "dark"
                ? <DarkModeIcon />
                : <LightModeIcon />
              }
            </IconButton>
          </div>
        </div>
      </Container>
    </div>
  );
};
