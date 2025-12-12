import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Profile from './Profile';
import Login from './Login';
import Body from './Body';
import Feed from './Feed/Feed';
import { useSelector } from 'react-redux';
import Connections from './connections/Connections';
import Requests from './requests/Requests';
import About from './About';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => (state.user));
    if (!user) {
        return <Navigate to="/auth/login" replace />;
    }
    return children;
};


const AppRoutes = () => {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Body />}>
                    <Route index element={<ProtectedRoute><Feed /></ProtectedRoute>} />
                    <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
                    <Route path="requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                    <Route path="/auth/:page" element={<Login />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Login />} />
                    <Route path="/pricing" element={<Login />} />
                    <Route path="/privacy" element={<Login />} />
                    <Route path="/terms" element={<Login />} />
                    <Route path="/refund" element={<Login />} />
                </Route>
            </Routes>
        </BrowserRouter></>)
}

export default AppRoutes;