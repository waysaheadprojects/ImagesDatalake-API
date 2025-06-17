// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const AdminAuthProvider = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("adminToken"); // change based on your auth logic

  return isAuthenticated ? children : <Navigate to="/admin" replace />;
};

export default AdminAuthProvider;
