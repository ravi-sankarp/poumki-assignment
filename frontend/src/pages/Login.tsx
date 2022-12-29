import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/Forms/LoginForm';
import { selectUserAuth } from '../redux/features/reducers/authSlice';

function Login() {
  const data = useSelector(selectUserAuth);
  if (data.token) {
    return <Navigate to="/" />;
  }

  return <LoginForm />;
}

export default Login;
