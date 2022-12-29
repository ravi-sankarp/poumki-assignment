import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  TablePagination,
  Typography
} from '@mui/material';
import * as yup from 'yup';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { IRegisterPayload, IUserInterface } from '../../Types/UserInterface';
import { toast } from 'react-toastify';
import { SocketArgument } from '../../Types/SocketCallback';
import PrimaryButton from '../Styled/PrimaryButton';
import ErrorField from '../Styled/ErrorFieldStyled';
import InputField from '../Styled/InputFieldStyled';
import LabelStyled from '../Styled/LabelStyled';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

export default function AdminHomeTable({
  data,
  setData,
  socket
}: {
  data: IUserInterface[];
  setData: React.Dispatch<React.SetStateAction<IUserInterface[]>>;
  socket: Socket;
}) {
  const [page, setPage] = useState(0);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState<IUserInterface>({
    _id: '',
    admin: false,
    email: '',
    firstName: '',
    lastName: '',
    createdAt: new Date()
  });
  const [operation, setOperation] = useState<'edit' | 'delete' | ''>('');

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
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    if (userData) {
      reset(userData);
    }
  }, [userData]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // for alert window
  const handleAlertShow = () => {
    setDialogOpen((current) => !current);
  };

  // open delete confirm dialog
  const handleAction = (selectedUser: IUserInterface, currentOperation: 'edit' | 'delete') => {
    setUserData(selectedUser);
    setOperation(currentOperation);
    handleAlertShow();
  };
  // handle edit
  const onSubmitHandler: SubmitHandler<IRegisterPayload> = async (data) => {
    if (!isLoading) {
      setIsLoading(true);
      socket.emit('admin-updated-data', data, userData._id, (res: SocketArgument) => {
        if (res.status === 'success') {
          toast.success('Successfully updated the user data', {
            position: 'bottom-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            closeButton: true
          });
          setData((prev) =>
            prev.map((user) => {
              if (user._id === res.data?._id) {
                return res.data;
              }
              return user;
            })
          );
          setDialogOpen(false);
        } else {
          setFormError(res.message);
        }
        setIsLoading(false);
      });
    }
  };

  // confirm delete
  const handleConfirmCategoryDelete = async () => {
    socket.emit('admin-deleteuser', userData._id, (res: SocketArgument) => {
      if (res.status === 'success') {
        setData(data.filter((user) => user._id !== userData._id));
        toast.success('Successfully deleted the user', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: true
        });
        setDialogOpen(false);
      } else {
        toast.error(res.message, {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: true
        });
      }
    });
  };
  return data.length ? (
    <>
      <Paper sx={{ mb: 5, mx: { md: 25 } }}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#2987de7a' }}>
              <TableRow>
                <TableCell align="center">First Name</TableCell>
                <TableCell align="center">Last Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Registered On</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    p: 0,
                    '& td': {
                      p: { md: 1 }
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                  }}
                >
                  <TableCell
                    data-label="First Name"
                    align="center"
                  >
                    {user.firstName}
                  </TableCell>
                  <TableCell
                    data-label="Last Name"
                    align="center"
                  >
                    {user.lastName}
                  </TableCell>
                  <TableCell
                    data-label="Email"
                    align="center"
                  >
                    {user.email}
                  </TableCell>
                  <TableCell
                    data-label="Registered On"
                    align="center"
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    data-label="Action"
                    align="center"
                  >
                    <IconButton
                      onClick={() => handleAction(user, 'edit')}
                      aria-label="edit"
                      color="primary"
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleAction(user, 'delete')}
                      aria-label="delete"
                      color="primary"
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={dialogOpen}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {operation === 'delete' ? (
          <>
            <DialogTitle id="alert-dialog-title">Confirm Delete </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <p>
                  Are you sure you want to delete the user{' '}
                  <Box
                    component="span"
                    sx={{ color: '#000', fontWeight: '800', textTransform: 'uppercase' }}
                  >
                    {userData.firstName + ' ' + userData.lastName}
                  </Box>
                </p>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
                onClick={handleAlertShow}
              >
                No
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fa5252',
                  '&:hover': { backgroundColor: '#e03131' }
                }}
                onClick={handleConfirmCategoryDelete}
              >
                Yes
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              <div style={{ display: 'flex' }}>
                <Typography
                  variant="h6"
                  component="div"
                  style={{ flexGrow: 1 }}
                >
                  Edit user
                </Typography>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleAlertShow}
                >
                  <CloseOutlinedIcon />
                </Button>
              </div>
            </DialogTitle>
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
                  Edit Details
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
                </Grid>

                <PrimaryButton type="submit">
                  {isLoading ? (
                    <CircularProgress
                      color="secondary"
                      sx={{ maxHeight: '20px', maxWidth: '20px' }}
                    />
                  ) : (
                    'Update'
                  )}
                </PrimaryButton>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  ) : (
    <>
      <Box sx={{ mt: 4 }}>
        <Typography align="center" variant='h6'>No users exists currently click to add one</Typography>
      </Box>
    </>
  );
}
