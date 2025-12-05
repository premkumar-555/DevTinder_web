import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_URL } from '../utils/constants';
import { Link, useNavigate } from 'react-router';
import { clearUser } from '../redux/userSlice';

const Navbar = () => {
    const user = useSelector((state) => (state.user));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const handleLogout = async () => {
        setLoading(true)
        try {
            const res = await axios.post(`${AUTH_URL}/logout`, {}, {
                withCredentials: true
            });
            if (res?.status === 200 || res?.statusText === "OK") {
                dispatch(clearUser())
                navigate('/login');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to='/' className="btn btn-ghost text-xl">🧑‍💻 devTinder</Link>
            </div>
            {user && <div className="flex gap-2">
                <div className="dropdown dropdown-end mx-6">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="user photo"
                                src={user?.profileUrl} />
                        </div>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li>
                            <Link to='/profile' className="justify-between">
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to='/connections' className="justify-between">
                                Connections
                            </Link>
                        </li>
                        <li>
                            <Link to='/requests' className="justify-between">
                                Requests
                            </Link>
                        </li>
                        <li onClick={handleLogout}>
                            {loading ? <span className="mx-auto loading loading-ring loading-xs"></span> : <a>Logout</a>}
                        </li>
                    </ul>
                </div>
            </div>}
        </div>
    )
}

export default Navbar