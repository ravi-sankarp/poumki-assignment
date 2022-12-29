import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import AddUser from '../components/Admin/AddUserForm';
import { selectAdminAuth } from '../redux/features/reducers/adminAuthSlice';

function AdminAddUser() {
  const data = useSelector(selectAdminAuth);
  if (data.token) {
    if (data.admin === true) {
      return <AddUser />;
    }
  }
  return <Navigate to="/admin/login" />;
}

export default AdminAddUser;
