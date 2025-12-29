import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { NEW_NOTIFICATION, PROFILE_URL } from '../utils/constants'
import { addUser } from '../redux/userSlice'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'
import MessageNotification from './Chat/MessageNotification'
import { mainSocket } from '../utils/sockets'

const Body = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [{ token: authToken }] = useCookies(['token']);
    const [loading, setLoading] = useState(false);
    const [socket, setsocket] = useState(mainSocket(authToken));

    const initSocket = () => {
        socket.connect();
        console.log('socket connected...?');
        // Listen newNotification event
        socket.on(NEW_NOTIFICATION, (payload) => {
            const { fromUser: { _id } } = payload;
            if (!location.pathname.includes((`/chat/${_id?.toString()}`))) {
                return MessageNotification({ payload });
            }
        });

    }

    const fetchUser = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${PROFILE_URL}/view`, { withCredentials: true });
            if (res?.data?.data) {
                dispatch(addUser(res?.data?.data));
                navigate('/');
            }
        } catch (err) {
            if (err?.status === 401) {
                navigate('/auth/login');
            }
            console.error(`Err @ fetchUser `, err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // fetch user profile is user store state is null and auth token exists in cookie
        if (!user && authToken) {
            fetchUser();
        }
    }, []);

    useEffect(() => {
        initSocket();

        return () => {
            socket.off(NEW_NOTIFICATION);
            socket.disconnect();
        }
    }, [])

    return (
        <div>
            <Navbar />
            <ToastContainer />
            {loading ? <div className="w-100 h-100 mx-auto flex justify-center content-center">
                <div className="w-15 h-15 m-auto loading loading-ring loading-5xl"></div>
            </div> : <div className='w-screen h-screen overflow-y-auto'>
                <Outlet />
            </div>}

            <Footer />
        </div>
    )
}

export default Body