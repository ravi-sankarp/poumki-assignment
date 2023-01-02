import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Home from '../components/home/Home';
import { selectUserAuth } from '../redux/features/reducers/authSlice';
import { IUserInterface } from '../Types/UserInterface';
import useApiErrorHandler from '../hooks/useApiErrorHandler';
import Spinner from '../components/Spinner';

const baseUrl =
  process.env.NODE_ENV === 'production' ? 'http://52.59.237.207' : 'localhost:8000';

function UserHome() {
  const { token } = useSelector(selectUserAuth);
  const handleError = useApiErrorHandler();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);
  const [userData, setUserData] = useState<IUserInterface | null>(null);
  const [socket, setSocket] = useState<Socket>();
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      toast.warning('Login to continue', {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        closeButton: true
      });
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const socket = io(baseUrl, {
      transports: ['websocket'],
      auth: { token }
    });

    setSocket(socket);

    socket.on('connect', () => {
      setIsLoading(false);
    });

    socket.on('userdata', (data: IUserInterface) => {
      setUserData(data);
    });

    socket.on('accountdeleted', () => {
      setIsDeleted(true);
    });

    socket.on('admin-updated-user', (data: IUserInterface) => {
      setUserData(data);
      toast.success('Admin updated your data', {
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
      console.log(err);
      handleError(err.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('userdata');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Home
      data={userData!}
      setData={setUserData}
      socket={socket!}
      isDeleted={isDeleted}
    />
  );
}

export default UserHome;
