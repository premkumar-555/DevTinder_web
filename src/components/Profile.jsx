import React, { useState } from "react";
import UserCard from "./Feed/userCard";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_URL } from "../utils/constants";
import { addUser } from "../redux/userSlice";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';


const Profile = () => {
    const { firstName,
        lastName,
        age,
        gender,
        about,
        profileUrl } = useSelector((state) => state.user)
    const [editInfo, setEditInfo] = useState({
        firstName,
        lastName,
        age,
        gender,
        about,
        profileUrl
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditInfo((pre) => ({ ...pre, [name]: value }));
    }

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.patch(PROFILE_URL + '/edit', { ...editInfo }, { withCredentials: true })
            if (res?.data?.data) {
                toast(res?.data?.message, {
                    position: "top-center",
                    type: 'success',
                    autoClose: 3000,
                })
                dispatch(addUser(res?.data?.data));
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="flex bg-base-200 justify-center content-center border-2 border-white">
            <form onSubmit={updateProfile}>
                <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-sm border p-6">
                    <h2 className="card-title justify-center text-xl">Edit Profile</h2>
                    <div className="h-100 overflow-y-auto">
                        <label className="label my-2">First Name</label>
                        <label className="input input-secondary validator">
                            <input defaultValue={editInfo?.firstName}
                                type="text"
                                required
                                placeholder="First name"
                                pattern="[A-Za-z][A-Za-z0-9\-]*"
                                title="Only letters, numbers or dash"
                                onChange={handleInputChange}
                                name='firstName'
                            />
                        </label>
                        <p className="validator-hint hidden">
                            Should contain only letters, numbers or dash
                        </p>
                        <label className="label  my-2">Last Name</label>
                        <label className="input input-secondary validator">
                            <input defaultValue={editInfo?.lastName}
                                type="text"
                                required
                                placeholder="Last name"
                                pattern="[A-Za-z][A-Za-z0-9\-]*"
                                title="Only letters, numbers or dash"
                                onChange={handleInputChange}
                                name='lastName'
                            />
                        </label>
                        <p className="validator-hint hidden">
                            Should contain only letters, numbers or dash
                        </p>
                        <label className="label  my-2">Age</label>
                        <label className="input input-secondary validator">
                            <input defaultValue={editInfo?.age}
                                type="number"
                                min={18}
                                placeholder="Age"
                                pattern="[A-Za-z][A-Za-z0-9\-]*"
                                title="Minimum age should be 18"
                                onChange={handleInputChange}
                                name='age'
                            />
                        </label>
                        <p className="validator-hint hidden">
                            Minimum age should be 18
                        </p>
                        <label className="label  my-2">Gender</label>
                        <select defaultValue={editInfo?.gender} className="select select-secondary"
                            name='gender'
                            onChange={handleInputChange}>
                            <option disabled={true}>Select Gender</option>
                            <option defaultValue='male'>Male</option>
                            <option defaultValue='female'>Female</option>
                            <option defaultValue='others'>Others</option>
                        </select>
                        <label className="label  my-2">Photo Url</label>
                        <label className="input input-secondary validator">
                            <input defaultValue={editInfo?.profileUrl}
                                type="url"
                                placeholder="https://"
                                pattern="^(https?://)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$"
                                onChange={handleInputChange}
                                name='profileUrl'
                            />
                        </label>
                        <p className="validator-hint hidden hidden">Must be valid URL</p>
                        <label className="label  my-2">About</label>
                        <textarea defaultValue={editInfo?.about}
                            className="textarea textarea-secondary"
                            onChange={handleInputChange}
                            name='about'
                        ></textarea>
                    </div>
                    <button className="btn btn-primary mx-auto mt-4" type="submit">
                        {loading && <span className="loading loading-ring loading-md"></span>}Submit
                    </button>
                </fieldset>
            </form>
            <div className="ml-10">
                <UserCard user={editInfo} />
            </div>
            <ToastContainer />
        </div>

    );
};



export default Profile;
