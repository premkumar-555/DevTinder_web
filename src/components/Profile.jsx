import React, { useState } from "react";
import UserCard from "./Feed/UserCard";
import { useDispatch, useSelector } from "react-redux";
import { PROFILE_URL } from "../utils/constants";
import { addUser } from "../redux/userSlice";
import axios from "axios";
import { Toast } from "../utils/toast";
import { useLocation } from "react-router";


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
        age: age || '',
        gender: gender || '',
        about: about || '',
        profileUrl
    })
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const curPath = useLocation()?.pathname;
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        error && setError("");
        const { name, value } = e.target;
        setEditInfo((pre) => ({ ...pre, [name]: value }));
    }

    const updateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data: { data: xData, message } } = await axios.patch(PROFILE_URL + '/edit', { ...editInfo }, { withCredentials: true })
            if (message) {
                Toast(message, { type: 'success' });
                dispatch(addUser(xData));
            }
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data || 'Something went wrong!');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-full flex bg-base-200 justify-center items-start p-4">
            <form onSubmit={updateProfile} className="h-full">
                <fieldset className="h-full fieldset bg-base-100 border-base-300 rounded-box w-sm border p-6">
                    <h2 className="card-title justify-center text-xl">Edit Profile</h2>
                    <div className="h-100 overflow-y-auto">
                        <label className="label my-2">First Name</label>
                        <label className="input input-secondary validator z-5">
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
                            <option >Select Gender</option>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='others'>Others</option>
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
                        <p className="validator-hint">Must be valid URL</p>
                        <label className="label  my-2">About</label>
                        <textarea defaultValue={editInfo?.about}
                            className="textarea textarea-secondary"
                            onChange={handleInputChange}
                            name='about'
                        ></textarea>
                    </div>
                    <p className="text-base text-red-400">
                        {error}
                    </p>
                    <button className="btn btn-primary mx-auto mt-4" type="submit">
                        {loading ? <span className="loading loading-ring loading-md"></span> : 'Submit'}
                    </button>
                </fieldset>
            </form>
            <div className="h-135 ml-15">
                <UserCard user={editInfo} curPath={curPath} />
            </div>

        </div>

    );
};



export default Profile;
