import { Navigate } from 'react-router-dom';

const ProtectedConsultantRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('consultantAuth');
  
  if (!isAuthenticated) {
    return <Navigate to="/consultant" replace />;
  }
  
  return children;
};

export default ProtectedConsultantRoute;
