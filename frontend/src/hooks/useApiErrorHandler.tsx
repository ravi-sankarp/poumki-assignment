import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiSlice } from '../redux/features/api/apiSlice';
import { deleteAdminToken } from '../redux/features/reducers/adminAuthSlice';
import { deleteToken } from '../redux/features/reducers/authSlice';

function useApiErrorHandler() {
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const handleTokenDelete = async () => {
    if (pathname.split('/').includes('admin')) {
      await dispatch(deleteAdminToken());
      await dispatch(apiSlice.util.resetApiState());
      navigate('/admin/login');
    } else {
      await dispatch(deleteToken());
      await dispatch(apiSlice.util.resetApiState());
      navigate('/login');
    }
  };
  useEffect(() => {
    if (error) {
      if (error === 'xhr poll error') {
        toast.error('Cannot establish connection ! Please check your internet connection', {
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
        toast.error(error, {
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
      if (
        error === 'User Account does not exists' ||
        error === 'Not authorized, Token is invalid'
      ) {
        handleTokenDelete();
      }
      setError('');
    }
  }, [error, dispatch, navigate, pathname]);
  return setError;
}

export default useApiErrorHandler;
