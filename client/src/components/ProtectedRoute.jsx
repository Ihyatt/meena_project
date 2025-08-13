import * as React from "react";
import { Navigate } from 'react-router-dom';
import useAuthStore from "src/pages/auth/store";

function ProtectedRoute({ children }) {

    const { isAuthenticated } = useAuthStore();

    return (
        <div>
            {isAuthenticated ? (
                children
            ) : (<Navigate to="/login" replace />)}
        </div>

    );

}

export default ProtectedRoute;