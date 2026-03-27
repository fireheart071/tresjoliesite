import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useAuth();

    if (isLoading) return <div>Checking auth...</div>;
    if (!token) return <Navigate to="/admin/login" />;

    return children;
};

export default ProtectedRoute;
