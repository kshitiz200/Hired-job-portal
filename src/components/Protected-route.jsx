import { useUser } from "@clerk/react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const { isLoaded, user, isSignedIn } = useUser();
    const { pathname } = useLocation();
    if (!isLoaded) {
        return <div>Loading...</div>;
    }
    if (!isSignedIn) {
        return <Navigate to="/?sign-in=true" replace />;
    }
    if(user!==undefined && !user.unsafeMetadata?.role && pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }   
    return children;
};

export default ProtectedRoute;