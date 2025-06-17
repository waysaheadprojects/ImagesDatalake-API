// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const AuthProvider = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("token"); // change based on your auth logic

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default AuthProvider;
