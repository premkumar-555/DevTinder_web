import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { REQUEST_URL, USER_URL } from '../../utils/constants';
import { Toast, TOAST_ERROR, TOAST_SUCCESS, TOAST_WARNING } from '../../utils/toast';
import { createRequestSocket, disconnectRequestSocket } from '../../utils/request.socket';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';


const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [revLoading, setRevLoading] = useState("");
    const [accepted, rejected] = ['accepted', 'rejected'];
    const [selectedReqId, setSelectedReqId] = useState(null);
    const reqNotifyRef = useRef(null);
    const [{ token }] = useCookies(['token']);
    const [reqSocket, setreqSocket] = useState(createRequestSocket(token));
    const loggedInUser = useSelector(state => state.user);
    const acceptNotifyRef = useRef(null);


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

    const reviewRequest = async (reqId, status, tarUserId = '') => {
        try {
            if (!(reqId && status)) {

                return null;
            }
            setRevLoading(status);
            const res = await axios.post(`${REQUEST_URL}/review/${status}/${reqId}`, {}, { withCredentials: true });
            if (res?.data?.message) {
                Toast(res?.data?.message, { type: TOAST_SUCCESS });
                fetchRequests();
                if (status === accepted && tarUserId) {
                    reqSocket.emit('acceptRequest', tarUserId)
                }
            }
        } catch (err) {
            if (err?.response?.data?.message) {
                Toast(err?.response?.data?.message, { type: TOAST_ERROR });
            }
            console.error(err);
        } finally {
            setRevLoading("");
        }
    }

    useEffect(() => {
        fetchRequests();

        // Listen for new connection request
        reqSocket.connect();
        reqSocket.on('receiveConnectionRequest', ({ toUserId, fromUserInfo }) => {
            if (toUserId === loggedInUser?._id && fromUserInfo && Object.values(fromUserInfo)?.length > 0) {
                if (acceptNotifyRef.current) {
                    clearTimeout(acceptNotifyRef.current);
                }
                acceptNotifyRef.current = setTimeout(() => {
                    fetchRequests();
                }, 1000);
            }
        });

        return () => {
            disconnectRequestSocket();
        }

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
            <div className='w-145 mx-auto h-140  p-4 overflow-y-auto'>
                {requests?.map(({ _id, fromUserId: { _id: tarUserId, firstName, lastName, age, gender, about, profileUrl } }, ind) => (<div key={ind}>
                    <div className="mx-auto w-auto flex justify-center items-center card card-side bg-base-300 shadow-sm border-2 border-secondary p-2 mt-4">
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
                        <div className="flex justify-center items-center gap-2">
                            <button className="btn btn-primary" disabled={revLoading} onClick={() => {
                                reviewRequest(_id, accepted, tarUserId);
                                setSelectedReqId(_id);
                            }}>
                                {(revLoading === accepted && selectedReqId === _id) ? <span className="loading loading-ring loading-md"></span> :
                                    'Accept'}

                            </button>
                            <button className="btn btn-error" disabled={revLoading} onClick={() => {
                                reviewRequest(_id, rejected);
                                setSelectedReqId(_id);
                            }}>
                                {(revLoading === rejected && selectedReqId === _id) ? <span className="loading loading-ring loading-md"></span> :
                                    'Reject'}
                            </button>
                        </div>
                    </div>
                </div>)
                )}</div>


        </div >
    )
}

export default Requests