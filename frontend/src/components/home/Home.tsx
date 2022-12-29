/* eslint-disable max-len */
import { Alert, Box, CircularProgress, Grid, Typography } from '@mui/material';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { deleteToken } from '../../redux/features/reducers/authSlice';
import { IRegisterPayload, IUserInterface } from '../../Types/UserInterface';
import PrimaryButton from '../Styled/PrimaryButton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import LabelStyled from '../Styled/LabelStyled';
import InputField from '../Styled/InputFieldStyled';
import ErrorField from '../Styled/ErrorFieldStyled';
import { SocketArgument } from '../../Types/SocketCallback';

function HomeTable({
  data,
  setData,
  socket,
  isDeleted
}: {
  data: IUserInterface;
  setData: React.Dispatch<React.SetStateAction<IUserInterface | null>>;
  socket: Socket;
  isDeleted: boolean;
}) {
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    let interval: NodeJS.Timer;
    console.log(timer > 0 && isDeleted);
    if (timer > 0 && isDeleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      handleLogout();
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer, isDeleted]);

  const schema = yup.object().shape({
    email: yup.string().email('Enter a valid email address').required('Please enter you email '),
    firstName: yup
      .string()
      .required('Please enter your first Name ')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as first name ')
      .min(4, 'First Name must be atleast 4 characters'),
    lastName: yup
      .string()
      .required('Please enter your last name')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed as last name ')
      .min(1, 'Last name must be atleast 1 character')
  });

  const { 
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema)
  });

  const onSubmitHandler: SubmitHandler<IRegisterPayload> = async (submitData) => {
    setIsLoading(true);
    socket.emit('user-updated-data', submitData, data._id, (res: SocketArgument) => {
      setIsLoading(false);
      if (res.status === 'success') {
        setCanEdit(false);
        toast.success('Successfully updated the data', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: true
        });
      } else {
        setFormError(res.message);
      }
    });
  };

  useEffect(() => {
    reset(data);
  }, [data]);

  const handleLogout = () => {
    dispatch(deleteToken());
    navigate('/login');
  };

  return (
    <section>
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
        <>
          <Box
            sx={{
              my: 5,
              width: { xs: '90vw', sm: '80vw' },
              maxWidth: { md: '40vw', lg: '30vw' },
              p: { xs: 0, md: 5 },
              px: { xs: 4 },
              py: { xs: 4, sm: 2 },
              textAlign: 'center',
              border: '2px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              minHeight: { xs: 'max-content', md: '50vh' },
              display: 'flex',
              flexDirection: 'column'
            }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
              onClick={() => setCanEdit((prev) => !prev)}
            >
              <Typography sx={{ textAlign: 'left', my: 3 }}>
                Click here to edit your details
              </Typography>
              <EditOutlinedIcon sx={{ fontSize: '1.2rem' }} />
            </Box>
            {isDeleted ? (
              <Alert
                sx={{ my: 1 }}
                severity="error"
              >
                Your account was deleted by the admin user You would be logged out in {timer} secs
              </Alert>
            ) : null}
            {formError ? (
              <Alert
                sx={{ my: 1 }}
                severity="error"
              >
                {formError}
              </Alert>
            ) : null}
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
                sm={6}
              >
                <LabelStyled htmlFor="firstName">First Name</LabelStyled>
                <InputField
                  disabled={!canEdit}
                  placeholder="Enter your first name"
                  inputProps={{ 'aria-label': 'first-name' }}
                  {...register('firstName')}
                />

                <ErrorField style={errors.firstName ? {} : { marginBottom: '19px' }}>
                  {errors.firstName ? errors.firstName.message : ''}
                </ErrorField>
              </Grid>
              <Grid
                item
                sm={6}
                xs={12}
              >
                <LabelStyled htmlFor="lastName">Last Name</LabelStyled>
                <InputField
                  disabled={!canEdit}
                  placeholder="Enter your last name"
                  inputProps={{ 'aria-label': 'last-name' }}
                  {...register('lastName')}
                />

                <ErrorField style={errors.lastName ? {} : { marginBottom: '19px' }}>
                  {errors.lastName ? errors.lastName.message : ''}
                </ErrorField>
              </Grid>
              <Grid
                item
                xs={12}
              >
                <LabelStyled htmlFor="email">Email</LabelStyled>
                <InputField
                  disabled={!canEdit}
                  placeholder="Enter your email address"
                  inputProps={{ 'aria-label': 'first-name' }}
                  {...register('email')}
                />

                <ErrorField style={errors.email ? {} : { marginBottom: '19px' }}>
                  {errors.email ? errors.email.message : ''}
                </ErrorField>
              </Grid>
            </Grid>
            <PrimaryButton
              type="submit"
              disabled={!canEdit}
            >
              {isLoading ? <CircularProgress color="secondary" /> : 'Update Details'}
            </PrimaryButton>
            <PrimaryButton onClick={handleLogout}>Logout</PrimaryButton>
          </Box>
        </>
      </Box>
    </section>
  );
}

export default HomeTable;
