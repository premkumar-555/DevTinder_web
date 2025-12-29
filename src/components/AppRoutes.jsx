import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import Profile from './Profile';
import Login from './Login';
import Body from './Body';
import Feed from './Feed/Feed';
import { useSelector } from 'react-redux';
import Connections from './connections/Connections';
import Requests from './requests/Requests';
import About from './About';
import Contact from './Contact.jsx';
import Pricing from './Pricing/Pricing';
import TermsConditions from './Terms&Conditions/TermsConditions.jsx';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';
import CancelRefund from './cancelRefund/CancelRefund.jsx';
import ChatBox from './Chat/ChatBox.jsx';
import { mainSocket } from '../utils/sockets.js';
import { useCookies } from 'react-cookie';
import { Toast, TOAST_SUCCESS } from '../utils/toast.js';
import MessageNotification from './Chat/messageNotification.jsx';
import { NEW_NOTIFICATION } from '../utils/constants.js';

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => (state.user));
    const [{ token: authToken }] = useCookies('token');
    const [socket, setsocket] = useState(mainSocket(authToken));

    const initSocket = () => {
        socket.connect();
        // Listen newNotification event
        socket.on(NEW_NOTIFICATION, (payload) => {
            console.log('NEW_NOTIFICATION : ', payload);
            const { fromUser: { _id } } = payload;
            if (!location.pathname.includes((`/chat/${_id?.toString()}`))) {
                return MessageNotification({ payload });
            }
        });

    }

    useEffect(() => {
        initSocket();

        return () => {
            socket.off(NEW_NOTIFICATION);
            socket.disconnect();
        }
    }, [])

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
                    <Route path="chat/:toUserId" element={<ProtectedRoute><ChatBox /></ProtectedRoute>} />
                    <Route path="/auth/:page" element={<Login />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="pricing" element={<Pricing />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="terms" element={<TermsConditions />} />
                    <Route path="refund" element={<CancelRefund />} />
                </Route>
            </Routes>
        </BrowserRouter></>)
}

export default AppRoutes;