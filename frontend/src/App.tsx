import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserHome />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          path="/admin/home"
          element={<AdminHome />}
        />
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={false}
        pauseOnHover={true}
      />
    </Router>
  );
}

export default App;
