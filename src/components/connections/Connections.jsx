import React, { useEffect, useState } from 'react'
import { USER_URL } from '../../utils/constants';
import axios from 'axios';
import Loading from '../Loading';

const Connections = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchConnections = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/connections', { withCredentials: true });
            if (res?.data?.data) {
                setConnections(res?.data?.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchConnections();
    }, []);

    if (loading) {
        return <div className="w-100 h-100 mx-auto flex justify-center content-center">
            <div className="w-15 h-15 m-auto loading loading-ring loading-5xl"></div>
        </div>
    }

    if (connections?.length === 0) return (
        <h1 className='text-center text-xl text-white mt-10'>No Connections found</h1>
    )

    return (
        <div>
            <h1 className='text-center text-xl font-bold text-white underline'>Connections</h1>
            <div className='w-125 mx-auto h-140  p-4 overflow-y-auto'>
                {connections?.map(({ firstName, lastName, age, gender, about, profileUrl }, ind) => (<div key={ind}>
                    <div className="mx-auto w-auto card card-side bg-base-300 shadow-sm border-2 border-secondary p-2 mt-4">
                        <figure>
                            <img className='size-25 rounded-full object-cover'

                                src={profileUrl}
                                alt="user photo" />
                        </figure>
                        <div className="card-body">
                            <h2 className="card-title">{firstName + " " + lastName}</h2>
                            {age && gender && <p>{age + ", " + gender}</p>}
                            <p>{about && about?.length > 150 ? about?.substring(0, 150) + '...' : about}</p>
                        </div>
                    </div>
                </div>)
                )}</div>


        </div>
    )
}

export default Connections