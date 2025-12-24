import React, { useEffect, useRef, useState } from 'react'
import { USER_URL } from '../../utils/constants';
import axios from 'axios';
import Loading from '../Loading';
import { Link } from 'react-router';
import { mainSocket, requestSocket } from '../../utils/sockets';
import { Toast, TOAST_SUCCESS } from '../../utils/toast';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';

const Connections = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(false);
    const loggedInUser = useSelector(state => state.user);
    const acceptNotifyRef = useRef(null);
    const [{ token: authToken }] = useCookies('token');
    const [reqSocket, setReqSocket] = useState(requestSocket(authToken));
    const [socket, setSocket] = useState(mainSocket(authToken));

    const fetchConnections = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/connections', { withCredentials: true });
            if (res?.data?.data) {
                setConnections(res?.data?.data);
                // emit 'getOnlineUsers' event
                const userIds = res?.data?.data?.map(el => el._id);
                socket.emit('getOnlineUsers', userIds);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleReqSocket = () => {
        // Connect reqSocket to server socket channel
        reqSocket.connect();
        // Listen for 'acceptRequest'
        reqSocket.on('requestAccepted', ({ toUserId, fromUserInfo }) => {
            if (toUserId === loggedInUser?._id && fromUserInfo && Object.values(fromUserInfo)?.length > 0) {
                if (acceptNotifyRef.current) {
                    clearTimeout(acceptNotifyRef.current);
                }
                acceptNotifyRef.current = setTimeout(() => {
                    fetchConnections();
                }, 1000);
            }
        });

        // listen errors 
        reqSocket.on('error', (err) => {
            console.error('socket error : ', err);
        })
    }

    const handleMainSocket = () => {
        socket.connect();
        // listen for live users
        socket.on('onlineUsers', (liveUserIds) => {
            // update feed users for online
            const liveUsersSet = new Set([...liveUserIds]);
            setConnections((pre) => {
                return pre?.map((user) => (liveUsersSet.has(user._id)) ? { ...user, isOnline: true } : user)
            });
        });

        // listen for user online event
        socket.on('userOnline', ({ userId }) => {
            // is user in current feed
            setConnections((pre) => (pre?.map(el => (el._id === userId) ? { ...el, isOnline: true } : el)));
        })

        // listen for user offline event
        socket.on('userOffline', ({ userId }) => {
            // is user in current feed
            setConnections((pre) => (pre?.map(user => user._id === userId ? { ...user, isOnline: false } : user)));
        })
    }

    useEffect(() => {
        handleReqSocket();
        handleMainSocket();
        fetchConnections();

        return () => {
            // disconnect reqSocket
            reqSocket.off();
            reqSocket.disconnect();
            socket.off();
            socket.disconnect();
        }
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
                {connections?.map(({ firstName, lastName, age, gender, about, profileUrl, _id, isOnline }, ind) => (<div key={ind}>
                    <div key={_id} className="flex justify-center items-center mx-auto w-auto card card-side bg-base-300 shadow-sm border-2 border-secondary p-2 mt-4">
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
                        <Link to={`/chat/${_id}`} class="btn btn-primary self-center mx-2">
                            <button >
                                Chat
                            </button>
                        </Link>
                    </div>
                </div>)
                )}</div>


        </div >
    )
}

export default Connections