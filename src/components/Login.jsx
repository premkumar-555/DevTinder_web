import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { useNavigate } from 'react-router';
import { authUrl } from '../utils/constants';

const Login = () => {
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${authUrl}/login`, {
                emailId, password
            }, { withCredentials: true });
            if (res && res?.data?.data) {
                dispatch(addUser(res?.data?.data));
                return navigate('/')
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong!')
            console.log("Err @ login : ", err || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (error) {
            setError('');
        }
    }, [emailId, password])

    return (
        <div className="card card-border bg-neutral w-96 mx-auto">
            <div className="card-body">
                <h2 className="card-title justify-center text-2xl">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className='my-6 space-y-8'>
                        <div>
                            <label className="input validator input-secondary input-md">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </g>
                                </svg>
                                <input type="email" placeholder="email ID" onChange={(e) => setEmailId(e.target.value)}
                                    required />
                            </label>
                            <div className="validator-hint hidden">Enter valid email address</div>
                        </div>
                        <div>
                            <label className="input validator input-secondary input-md">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                                        ></path>
                                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    minLength="8"
                                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be more than 8 characters, including
                                <br />At least one number <br />At least one lowercase letter <br />At least one uppercase letter
                            </p>
                        </div>
                    </div>
                    <p className="text-base text-red-400">
                        {error}
                    </p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary mx-auto my-2" type='submit'>
                            {loading ? <span className="loading loading-ring loading-md"></span> : 'Submit'}</button>

                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login