// components/PrivateRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const loading = useAppSelector((state) => state.auth.loading);

    if (loading) return <div>Cargando...</div>;

    if (!isAuthenticated) return <Navigate to="/login" />;

    return children;
}
