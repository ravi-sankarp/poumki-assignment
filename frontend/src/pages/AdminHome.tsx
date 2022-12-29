import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import { toast } from 'react-toastify';

import AdminHomeTable from '../components/Admin/AdminHomeTable';
import StyledTab from '../components/Styled/TabStyled';
import Spinner from '../components/Spinner';
import { deleteAdminToken, selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';
import { IUserInterface } from '../Types/UserInterface';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import PrimaryButton from '../components/Styled/PrimaryButton';
import DeleteDialog from '../components/Admin/DeleteDialog';
import { SocketArgument } from '../Types/SocketCallback';
import AddUserForm from '../components/Admin/AddUserForm';
import TaskTab from '../components/Admin/TaskTab';

function AdminHome() {
  const { token } = useSelector(selectAdminAuth);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const handleError = useApiErrorHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [search, setSearch] = useSearchParams();
  const [socket, setSocket] = useState<Socket>();
  const [userData, setUserData] = useState<IUserInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [value, setValue] = useState(search.get('selected') ?? 'dashboard');

  useLayoutEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, []);

  useEffect(() => {
    if (!search.get('selected')) {
      search.set('selected', 'dashboard');
      setSearch(search);
    }
    if (search.get('selected')) {
      const selected = search.get('selected');
      if (selected !== 'dashboard' && selected !== 'task') {
        search.set('selected', 'dashboard');
        setSearch(search);
        setValue('dashboard');
      }
    }
  }, [search, setSearch, value]);

  useEffect(() => {
    const socket = io('http://localhost:8000', {
      auth: { token }
    });

    setSocket(socket);

    socket.on('connect', () => {
      setIsLoading(false);
    });

    socket.on('userlist', (data: IUserInterface[]) => {
      setUserData(data);
    });

    socket.on('user-updated-data', (data: IUserInterface) => {
      setUserData((prev) =>
        prev.map((user) => {
          if (user._id === data._id) {
            return data;
          }

          return user;
        })
      );
      toast.success(`${data.firstName} ${data.lastName} updated the data`, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: true
      });
    });

    socket.on('newuser-created', (data: IUserInterface) => {
      setUserData((prev) => [...prev, data]);
      toast.success(`${data.firstName} ${data.lastName} created a new account`, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: true
      });
    });

    socket.on('newuser-added', (data: IUserInterface) => {
      setUserData((prev) => [...prev, data]);
      toast.success(`${data.firstName} ${data.lastName} created a new account`, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: true
      });
    });

    socket.on('disconnect', () => {
      setIsLoading(true);
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
      handleError(err.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('userlist');
      socket.off('user-updated-data');
      socket.off('newuser-created');
      socket.off('newuser-added');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  const handleLogout = () => {
    dispatch(deleteAdminToken());
    navigate('/admin/login');
  };

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    search.set('selected', newValue);
    setSearch(search);
    setValue(newValue);
  };

  const handleConfirmDelete = () => {
    socket?.emit('admin-deleteallusers', (res: SocketArgument) => {
      if (res.status === 'success') {
        toast.success('All users where deleted', {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          closeButton: true
        });
        setUserData([]);
        setOpenDeleteModal(false);
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Box
      sx={{
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
        pt: 4,
        backgroundColor: '#f1f3f6',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            width: { xs: '100vw', md: 'max-content' },
            height: 'max-content',
            backgroundColor: '#fff',

            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
          }}
        >
          <TabList
            centered
            variant="fullWidth"
            orientation="horizontal"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="Admin Tabs"
          >
            <StyledTab
              label="Manage Users"
              icon={<HomeOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              aria-label="favorite"
              iconPosition="start"
              value="dashboard"
              sx={{ borderRight: '2px solid rgba(0,0,0,0.8)' }}
            />
            <StyledTab
              label="Reverse "
              icon={<WalletOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              aria-label="person"
              iconPosition="start"
              value="task"
            />
          </TabList>
        </Box>
        <Box
          sx={{
            minWidth: '70vw',
            flexGrow: 1
          }}
        >
          <TabPanel
            value="dashboard"
            sx={{ mb: 0 }}
          >
            <Box sx={{ backgroundColor: '#fff', py: 5, borderRadius: '10px' }}>
              <Typography
                variant="h4"
                align="center"
              >
                USERS
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  px: 5
                }}
              >
                <PrimaryButton onClick={() => setOpenAddModal(true)}>Add New User</PrimaryButton>
                <PrimaryButton
                  sx={{
                    backgroundColor: '#d32f2f',
                    '&:hover': {
                      backgroundColor: '#cb2121 '
                    }
                  }}
                  onClick={() => setOpenDeleteModal(true)}
                >
                  Delete All Users
                </PrimaryButton>
              </Box>

              <AdminHomeTable
                data={userData}
                setData={setUserData}
                socket={socket!}
              />
              {openDeleteModal ? (
                <DeleteDialog
                  handleConfirmDelete={handleConfirmDelete}
                  openDeleteModal={openDeleteModal}
                  setOpenDeleteModal={setOpenDeleteModal}
                />
              ) : null}
              {openAddModal ? (
                <AddUserForm
                  openAddModal={openAddModal}
                  setOpenAddModal={setOpenAddModal}
                  socket={socket!}
                />
              ) : null}
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PrimaryButton onClick={() => setDialogOpen(true)}>Logout</PrimaryButton>
              </Box>
              <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Confirm Logout </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <p>Are you sure you want to logout</p>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
                    onClick={() => setDialogOpen(false)}
                  >
                    No
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#fa5252',
                      '&:hover': { backgroundColor: '#e03131' }
                    }}
                    onClick={handleLogout}
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </TabPanel>
          <TabPanel
            value="task"
            sx={{ mb: 0 }}
          >
            <TaskTab />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}

export default AdminHome;
