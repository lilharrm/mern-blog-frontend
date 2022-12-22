import React from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';

import styles from './Login.module.scss';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import PasswordStrengthBar from 'react-password-strength-bar';

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      checkPassword: ''
    },
    mode: 'onChange'
  });
  const [values, setValues] = React.useState({
    password: "",
    passwordStrenght: 0,
    showPassword: false,
    showCheckPassword: false
  });

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert('Nepavyko užsiregistruoti');
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    }
  };

  if (isAuth) {
    return <Navigate to="/" />
  }

  const handlePasswordStrenghtChange = (strenght) => {
    setValues({
      ...values,
      passwordStrenght: strenght
    });
  };

  const handlePasswordChange = (newPassword) => {
    setValues({
      ...values,
      password: newPassword
    });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleClickShowCheckPassword = () => {
    setValues({
      ...values,
      showCheckPassword: !values.showCheckPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownCheckPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Sukurti paskyrą
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputLabel htmlFor="outlined-fullName">Vardas, Pavardė</InputLabel>
        <OutlinedInput
          id="outlined-fullName"
          className={styles.field}
          label="Vardas, Pavardė"
          error={Boolean(errors.fullName?.message)}
          type="text"
          helperText={errors.fullName?.message}
          {...register('fullName', { required: 'Įveskite vardą, pavardę' })}
          fullWidth
        />
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
          {...register('password', {
            required: 'Įveskite slaptažodi',
            validate: (val) => {
              handlePasswordChange(val)
            }
          })}
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
        <PasswordStrengthBar
        password={values.password}
        scoreWords={["silpnas", "silpnas", "vidutiniškas", "geras", "puikus"]}
        shortScoreWord="per trumpas"
        onChangeScore={(score, feedback) => {handlePasswordStrenghtChange(score)}}
        />
        <InputLabel htmlFor="outlined-adornment-checkPassword">Pakartokite slaptažodį</InputLabel>
        <OutlinedInput
          id="outlined-adornment-checkPassword"
          className={styles.field}
          label="Pakartokite slaptažodį"
          type={values.showCheckPassword ? 'text' : 'password'}
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("checkPassword", {
            required: "Slaptažodis turi sutapti",
            validate: (val) => {
              if (watch('password') !== val) {
                return "Slaptažodis turi sutapti";
              }
            },
          })}
          fullWidth
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowCheckPassword}
                onMouseDown={handleMouseDownCheckPassword}
              >
                {values.showCheckPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {errors && (
          <FormHelperText error id="accountId-error">
            <div>{errors?.fullName?.message}</div>
            <div>{errors?.email?.message}</div>
            <div>{errors?.password?.message}</div>
            <div>{errors?.checkPassword?.message}</div>
          </FormHelperText>
        )}
        <Button disabled={!isValid && values?.score > 2} type="submit" size="large" variant="contained" fullWidth>
          Užsiregistruoti
        </Button>
      </form>
    </Paper>
  );
};
