import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Alert, Box, CircularProgress, Grid, Typography } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useAdminLoginMutation } from '../../redux/features/api/apiSlice';
import { setToken } from '../../redux/features/reducers/authSlice';
import { toast } from 'react-toastify';
import { ILoginPayload } from '../../Types/UserInterface';
import InputField from '../Styled/InputFieldStyled';
import ErrorField from '../Styled/ErrorFieldStyled';
import LabelStyled from '../Styled/LabelStyled';
import PrimaryButton from '../Styled/PrimaryButton';
import { setAdminToken } from '../../redux/features/reducers/adminAuthSlice';

function AdminLoginForm() {
  const [formError, setFormError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userLogin, { isLoading }] = useAdminLoginMutation();
  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email address').required('Please enter you email '),
    password: yup
      .string()
      .required('Please enter your password')
      .min(3, 'Password must be atleast 3 characters')
  });
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginPayload>({
    resolver: yupResolver(schema)
  });
  const formSubmit: SubmitHandler<ILoginPayload> = async (data) => {
    if (!isLoading) {
      try {
        const res = await userLogin(data).unwrap();
        if (res.status === 'Success') {
          dispatch(setAdminToken(res));
          toast.success('Login Successfull', {
            position: 'bottom-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            closeButton: true
          });
          navigate('/admin/home');
        }
      } catch (err: any) {
        setFormError(err?.data?.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: '#1098ad',
        justifyContent: 'center',
        alignItems: { xs: 'flex-start', md: 'center' },
        py: { xs: 5, md: 0 }
      }}
    >
      <Box
        sx={{
          my: 5,
          width: { xs: '90vw', sm: '80vw' },
          maxWidth: { md: '40vw', lg: '30vw' },
          p: { xs: 0, md: 5 },
          px: { xs: 4 },
          py: { xs: 4, sm: 2 },
          textAlign: 'center',
          backgroundColor: '#ffffff',
          minHeight: { xs: 'max-content', md: '50vh' },
          display: 'flex',
          flexDirection: 'column'
        }}
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(formSubmit)}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ my: '2rem', textAlign: 'center' }}
        >
          LOGIN
        </Typography>

        {formError && (
          <Alert
            sx={{ mb: 1 }}
            severity="error"
          >
            {formError}!
          </Alert>
        )}
        <Grid
          container
          spacing={1}
          textAlign="left"
          sx={{
            mb: 3
          }}
        >
          <Grid
            item
            xs={12}
          >
            <LabelStyled htmlFor="email">Email</LabelStyled>
            <InputField
              type="email"
              placeholder="Enter your email address"
              inputProps={{ 'aria-label': 'first-name' }}
              {...register('email')}
            />

            <ErrorField style={errors.email ? {} : { marginBottom: '19px' }}>
              {errors.email ? errors.email.message : ''}
            </ErrorField>
          </Grid>
          <Grid
            item
            xs={12}
          >
            <LabelStyled htmlFor="password">Password</LabelStyled>
            <InputField
              type="password"
              placeholder="Enter a new password"
              inputProps={{ 'aria-label': 'password' }}
              {...register('password')}
            />

            <ErrorField style={errors.password ? {} : { marginBottom: '19px' }}>
              {errors.password ? errors.password.message : ''}
            </ErrorField>
          </Grid>
        </Grid>

        <Typography
          role="button"
          variant="subtitle2"
          sx={{
            m: 0,
            color: '#101010',
            textAlign: 'left',
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
          onClick={() => {
            setFormError('');
            reset();
          }}
        >
          Clear All
        </Typography>

        <PrimaryButton type="submit">
          {isLoading ? (
            <CircularProgress
              color="secondary"
              sx={{ maxHeight: '20px', maxWidth: '20px' }}
            />
          ) : (
            'Login'
          )}
        </PrimaryButton>
      </Box>
    </Box>
  );
}

export default AdminLoginForm;
