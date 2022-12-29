import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import UserRegisterForm from '../components/Forms/RegisterForm';
import { selectUserAuth } from '../redux/features/reducers/authSlice';

function Register() {
  const data = useSelector(selectUserAuth);
  if (data.token) {
    return <Navigate to="/" />;
  }

  return <UserRegisterForm />;
}

export default Register;
