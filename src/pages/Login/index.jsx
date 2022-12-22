import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useForm } from 'react-hook-form';

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import { fetchAuth, selectIsAuth } from '../../redux/slices/auth.js';

import styles from "./Login.module.scss";

export const Login = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onChange'
  });
  const [values, setValues] = React.useState({
    showPassword: false
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchAuth(values));

    if (!data.payload) {
      return alert('Nepavyko prisijungti');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />
  }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Prisijungti prie paskyros
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputLabel htmlFor="outlined-email">El. paštas</InputLabel>
        <OutlinedInput
          id="outlined-email"
          className={styles.field}
          label="El. paštas"
          error={Boolean(errors.email?.message)}
          type="email"
          helperText={errors.email?.message}
          {...register('email', { required: 'Įveskite el. paštą' })}
          fullWidth
        />
        <InputLabel htmlFor="outlined-adornment-password">Slaptažodis</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          className={styles.field}
          label="Slaptažodis"
          type={values.showPassword ? 'text' : 'password'}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', { required: 'Įveskite slaptažodi' })}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {values.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors && (
          <FormHelperText error id="accountId-error">
            <div>{errors?.password?.message}</div>
            <div>{errors?.email?.message}</div>
          </FormHelperText>
        )}
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Prisijungti
        </Button>
      </form>
    </Paper>
  );
};
