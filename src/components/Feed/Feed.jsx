import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { REQUEST_URL, USER_URL } from '../../utils/constants';
import { addFeed } from '../../redux/feedSlice';
import UserCard from './UserCard';
import { Toast, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/toast';
import { useLocation } from 'react-router';
import { mainSocket, requestSocket } from '../../utils/sockets';
import { useCookies } from 'react-cookie';

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector(state => state.feed);
    const feedRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(null);
    const curPath = useLocation()?.pathname;
    const loggedInUser = useSelector(state => state.user);
    const reqNotifyRef = useRef(null);
    const acceptNotifyRef = useRef(null);
    const [{ token: authToken }] = useCookies('token');
    const [reqSocket, setReqSocket] = useState(requestSocket(authToken))
    const [socket, setSocket] = useState(mainSocket(authToken))

    const getFeed = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/feed', { withCredentials: true });
            if (res?.data?.data) {
                fetchOnlineSocketUsers(res?.data?.data);
                dispatch(addFeed(res?.data?.data));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleRequest = async (status, userId) => {
        try {
            if (!(status && userId)) {
                return;
            }
            setBtnLoading(status);
            const res = await axios.post(REQUEST_URL + `/send/${status}/${userId}`, {}, { withCredentials: true });
            if (res?.data?.message) {
                if (status === 'interested') {
                    reqSocket.emit('sendConnectionRequest', userId);
                    Toast(res.data.message, { type: TOAST_SUCCESS });
                }
                getFeed();
            }
        } catch (err) {
            if (err?.response?.data?.message) {
                Toast(err?.response?.data?.message, { type: TOAST_ERROR });
            }
            console.error(err);
        } finally {
            setBtnLoading(null);
        }
    }

    const handleReqSocket = () => {
        // Connect reqSocket to server socket channel
        reqSocket.connect();

        // Listen for 'receiveConnectionRequest'
        reqSocket.on('receiveConnectionRequest', ({ toUserId, fromUserInfo }) => {
            if (toUserId === loggedInUser?._id && fromUserInfo && Object.values(fromUserInfo)?.length > 0) {
                if (reqNotifyRef.current) {
                    clearTimeout(reqNotifyRef.current);
                }
                reqNotifyRef.current = setTimeout(() => {
                    getFeed();
                }, 1000);
            }
        });

        // Listen for 'acceptRequest'
        reqSocket.on('requestAccepted', ({ toUserId, fromUserInfo }) => {
            if (toUserId === loggedInUser?._id && fromUserInfo && Object.values(fromUserInfo)?.length > 0) {
                if (acceptNotifyRef.current) {
                    clearTimeout(acceptNotifyRef.current);
                }
                acceptNotifyRef.current = setTimeout(() => {
                    const msg = `${fromUserInfo?.firstName} ${fromUserInfo?.lastName} accepted your request!`;
                    Toast(msg, { type: TOAST_SUCCESS, autoClose: 5000 });
                }, 1000);
            }
        });

        // listen errors 
        reqSocket.on('error', (err) => {
            console.error('socket error : ', err);
        })
    }

    const fetchOnlineSocketUsers = (data) => {
        // emit 'getOnlineUsers' event
        feedRef.current = data;
        const userIds = data?.map(el => el._id);
        socket.emit('getOnlineUsers', userIds);
    }

    const handleMainSocket = () => {
        socket.connect();
        // listen for live users
        socket.on('onlineUsers', (liveUserIds) => {
            // update feed users for online
            const liveUsersSet = new Set([...liveUserIds]);
            const liveUsers = feedRef?.current?.map((user) => liveUsersSet.has(user._id) ? { ...user, isOnline: true } : user);
            dispatch(addFeed(liveUsers));
        });

        // listen for user online event
        socket.on('userOnline', ({ userId }) => {
            // is user in current feed
            const isInFeed = feedRef.current?.find(el => el._id === userId);
            if (isInFeed) {
                const updatedFeed = feedRef.current?.map(el => (el._id === isInFeed._id) ? { ...el, isOnline: true } : el);
                dispatch(addFeed(updatedFeed));
                feedRef.current = updatedFeed;
            }
        })

        // listen for user offline event
        socket.on('userOffline', ({ userId }) => {
            // is user in current feed
            dispatch(addFeed((feedRef.current?.map(user => user._id === userId ? { ...user, isOnline: false } : user))));
        })
    }

    useEffect(() => {
        handleMainSocket();
        handleReqSocket();
        getFeed();
        return () => {
            reqSocket.off();
            reqSocket.disconnect();
            socket.off();
            socket.disconnect();
        }
    }, []);

    if (loading) {
        return (<div className="w-100 h-100 mx-auto flex justify-center content-center">
            <div className="w-15 h-15 m-auto loading loading-ring loading-5xl"></div>
        </div>)
    }

    return (
        feed && feed?.length > 0 ? (
            <div className='h-screen bg-base-200 py-6'>
                <div className='h-125'>
                    <UserCard user={feed[0]} curPath={curPath} handleRequest={handleRequest} btnLoading={btnLoading} />
                </div>
            </div>
        ) : <h1 className='text-center text-xl font-bold text-white underline'>No feed found</h1>
    )

}

export default Feed