import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { Link, useNavigate, useParams } from 'react-router';
import { AUTH_URL } from '../utils/constants';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { page } = useParams();
    const [formData, setFormData] = useState({
        emailId: '',
        password: '',
        ...(page === 'signup') && ({
            firstName: '',
            lastName: '',
        })
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((pre) => ({ ...pre, [name]: value }));
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data: { data: userData } } = await axios.post(`${AUTH_URL}/${page === 'login' ? 'login' : 'signup'}`,
                formData,
                { withCredentials: true });
            if (userData) {
                dispatch(addUser(userData));
                return navigate(`${page === 'login' ? '/' : '/profile'}`);
            }
        } catch (err) {
            setError(err?.response?.data?.message || 'Something went wrong!')
            console.error("Err @ login : ", err || 'Something went wrong!');
        } finally {
            setLoading(false);
        }
    }

    const clearErrors = () => {
        if (error) {
            setError('');
        }
    }

    useEffect(() => {
        clearErrors();
    }, [formData]);

    return (
        <div className="h-full card card-border bg-neutral w-96 mx-auto">
            <div className="card-body">
                <h2 className="card-title justify-center text-2xl">{page === 'login' ? 'Login' : 'Sign up'}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className={`my-6 space-y-8 overflow-y-auto ${page === 'signup' ? 'h-70' : 'h-full'}`} >
                        {page === 'signup' && (<>
                            <label className="input validator input-secondary">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="text"
                                    required
                                    placeholder="First name"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minLength="3"
                                    maxLength="12"
                                    title="Only letters, numbers or dash"
                                    name="firstName"
                                    onChange={handleInputChange}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be 3 to 12 characters
                                <br />containing only letters, numbers or dash
                            </p>
                            <label className="input validator input-secondary">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                        strokeLinejoin="round"
                                        strokeLinecap="round"
                                        strokeWidth="2.5"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </g>
                                </svg>
                                <input
                                    type="text"
                                    required
                                    placeholder="Last name"
                                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                                    minlength="3"
                                    maxlength="12"
                                    title="Only letters, numbers or dash"
                                    name="lastName"
                                    onChange={handleInputChange}
                                />
                            </label>
                            <p className="validator-hint hidden">
                                Must be 3 to 12 characters
                                <br />containing only letters, numbers or dash
                            </p>
                        </>)}

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
                                <input type="email" placeholder="email ID"
                                    name="emailId"
                                    onChange={handleInputChange}
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
                                    name="password"
                                    onChange={handleInputChange}
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
                    <div className="card-actions justify-end my-5">
                        <button className="btn btn-primary mx-auto " type='submit'>
                            {loading ? <span className="loading loading-ring loading-md"></span> :
                                (page === 'login' ? 'Login' : 'Signup')}
                        </button>
                    </div>
                    <div className='flex justify-center items-center'>
                        <p className='text-md text-white font-medium text-center'>{page === 'login' ? <Link to="/auth/signup">New user ? signup here</Link> :
                            <Link to="/auth/login">Existing user? login here</Link>}</p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login