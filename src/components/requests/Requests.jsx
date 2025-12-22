import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { REQUEST_URL, USER_URL } from '../../utils/constants';
import { Toast, TOAST_ERROR, TOAST_SUCCESS, TOAST_WARNING } from '../../utils/toast';
import { mainSocket, requestSocket } from '../../utils/sockets';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';


const Requests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [revLoading, setRevLoading] = useState("");
    const [accepted, rejected] = ['accepted', 'rejected'];
    const [selectedReqId, setSelectedReqId] = useState(null);
    const loggedInUser = useSelector(state => state.user);
    const acceptNotifyRef = useRef(null);
    const [{ token: authToken }] = useCookies('token');
    const [reqSocket, setReqSocket] = useState(requestSocket(authToken))
    const [socket, setSocket] = useState(mainSocket(authToken));

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/requests/received', { withCredentials: true });
            if (res?.data?.data) {
                setRequests(res?.data?.data);
                // emit 'getOnlineUsers' event
                const userIds = res?.data?.data?.map(el => el?.fromUserId?._id);
                socket.emit('getOnlineUsers', userIds);
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

    const handleMainSocket = () => {
        socket.connect();
        // listen for live users
        socket.on('onlineUsers', (liveUserIds) => {
            // update feed users for online
            const liveUsersSet = new Set([...liveUserIds]);
            setRequests((pre) => pre?.map((user) => (liveUsersSet.has(user?.fromUserId?._id) ? { ...user, isOnline: true } : user)))
        });

        // listen for user online event
        socket.on('userOnline', ({ userId }) => {
            // is user in current feed
            const isInFeed = requests?.find(el => el._id?.toString() === userId?.toString());
            if (isInFeed) {
                setRequests((pre) => pre?.map((el) => el._id === isInFeed._id ? { ...el, isOnline: true } : el))
            }
        })
    }

    const handleReqSocket = () => {
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
    }

    useEffect(() => {
        handleMainSocket();
        handleReqSocket();
        fetchRequests();

        return () => {
            reqSocket.off();
            reqSocket.disconnect();
            socket.disconnect();
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
                {requests?.map(({ _id, fromUserId: { _id: tarUserId, firstName, lastName, age, gender, about, profileUrl }, isOnline }, ind) => (<div key={ind}>
                    <div className="mx-auto w-auto flex justify-center items-center card card-side bg-base-300 shadow-sm border-2 border-secondary p-2 mt-4">
                        <div className={`avatar ${isOnline === true ? 'avatar-online avatar-placeholder' : ''}`}>
                            <div className="size-24 rounded-full">
                                <img src={profileUrl} alt="user photo" />
                            </div>
                        </div>
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