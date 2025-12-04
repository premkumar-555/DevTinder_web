import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { USER_URL } from '../../utils/constants';

const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/requests/received', { withCredentials: true });
            if (res?.data?.data) {
                setRequests(res?.data?.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRequests();
    }, []);

    if (loading) {
        return <div className="w-100 h-100 mx-auto flex justify-center content-center">
            <div className="w-15 h-15 m-auto loading loading-ring loading-5xl"></div>
        </div>
    }

    if (requests?.length === 0) return (
        <h1 className='text-center text-xl text-white mt-10'>No Requests found</h1>
    )

    return (
        <div>
            <h1 className='text-center text-xl font-bold text-white underline'>Connection requests</h1>
            <div className='w-125 mx-auto h-140  p-4 overflow-y-auto'>
                {requests?.map(({ fromUserId: { firstName, lastName, age, gender, about, profileUrl } }, ind) => (<div key={ind}>
                    <div className="mx-auto max-w-full flex justify-center items-center card card-side bg-base-300 shadow-sm border-2 border-secondary p-2 mt-4">
                        <figure>
                            <img className='size-25 rounded-full object-cover'
                                src={profileUrl}
                                alt="user photo" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{firstName + " " + lastName}</h2>
                            {age && gender && <p>{age + ", " + gender}</p>}
                            {about && <p>{about}</p>}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <button className="btn btn-primary">Accept</button>
                            <button className="btn btn-error">Reject</button>
                        </div>
                    </div>
                </div>)
                )}</div>


        </div>
    )
}

export default Requests