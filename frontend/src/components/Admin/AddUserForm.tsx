import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography
} from '@mui/material';
import { Socket } from 'socket.io-client';
import { IRegisterPayload } from '../../Types/UserInterface';
import LabelStyled from '../Styled/LabelStyled';
import InputField from '../Styled/InputFieldStyled';
import ErrorField from '../Styled/ErrorFieldStyled';
import PrimaryButton from '../Styled/PrimaryButton';
import { SocketArgument } from '../../Types/SocketCallback';

type Props = {
  openAddModal: boolean;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket;
};

function AddUserForm({ openAddModal, setOpenAddModal, socket }: Props) {
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
      .min(1, 'Last name must be atleast 1 character'),
    password: yup
      .string()
      .required('Please enter your password')
      .min(3, 'Password must be atleast 3 characters'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password')
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<IRegisterPayload>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmitHandler: SubmitHandler<IRegisterPayload> = async (data) => {
    if (!isLoading) {
      setIsLoading(true);
      socket.emit('admin-add-newuser', data, (res: SocketArgument) => {
        if (res.status === 'success') {
          setOpenAddModal(false);
        } else {
          setFormError(res.message);
        }
        setIsLoading(false);
      });
    }
  };

  return (
    <Dialog
      open={openAddModal}
      onClose={() => setOpenAddModal(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ minHeight: '80vh' }}
    >
      <DialogTitle>
        <div style={{ display: 'flex' }}>
          <Typography
            variant="h6"
            component="div"
            style={{ flexGrow: 1 }}
          >
            Add User
          </Typography>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => setOpenAddModal(false)}
          >
            <CloseOutlinedIcon />
          </Button>
        </div>
      </DialogTitle>{' '}
      <DialogContent dividers>
        <Box
          sx={{
            my: 1,
            width: { xs: '90vw', sm: '80vw' },
            maxWidth: { md: '40vw', lg: '30vw' },
            px: 4,
            py: { xs: 4, sm: 1 },
            textAlign: 'center',
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
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: '2rem', textAlign: 'center', p: 0 }}
          >
            Create Account
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
              sm={6}
            >
              <LabelStyled htmlFor="firstName">First Name</LabelStyled>
              <InputField
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
            <Grid
              item
              xs={12}
            >
              <LabelStyled htmlFor="confirmPassword">Confirm Password</LabelStyled>
              <InputField
                type="password"
                placeholder="Please confirm your password"
                inputProps={{ 'aria-label': 'confirm-password' }}
                {...register('confirmPassword')}
              />

              <ErrorField style={errors.confirmPassword ? {} : { marginBottom: '19px' }}>
                {errors.confirmPassword ? errors.confirmPassword.message : ''}
              </ErrorField>
            </Grid>
          </Grid>

          <Typography
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
              'Add Account'
            )}
          </PrimaryButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default AddUserForm;
