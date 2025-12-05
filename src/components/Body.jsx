import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { Outlet, useNavigate } from 'react-router'
import Footer from './Footer'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { PROFILE_URL } from '../utils/constants'
import { addUser } from '../redux/userSlice'
import { useCookies } from 'react-cookie'
import { ToastContainer } from 'react-toastify'

const Body = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [{ token: authToken }] = useCookies(['token']);
    const [loading, setLoading] = useState(false);

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

    return (
        <div>
            <Navbar />
            <ToastContainer />
            {loading ? <div className="w-100 h-100 mx-auto flex justify-center content-center">
                <div className="w-15 h-15 m-auto loading loading-ring loading-5xl"></div>
            </div> : <Outlet />}

            <Footer />
        </div>
    )
}

export default Body