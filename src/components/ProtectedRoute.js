import React from "react";
import {Navigate} from 'react-router-dom';
import AuthControl, { UserAuth } from "../contexts/auth";

const ProtectedRoute = ({children}) => {
    const {user} = UserAuth();
    if(!user){
        return <Navigate to= '/auth'/>
    }

    return children;
    
};

export default ProtectedRoute;