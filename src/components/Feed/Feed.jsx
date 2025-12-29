import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NEW_NOTIFICATION, NEW_REQUEST, ONLINE_USERS, REQUEST_URL, USER_OFFLINE, USER_ONLINE, USER_URL } from '../../utils/constants';
import { addFeed } from '../../redux/feedSlice';
import UserCard from './UserCard';
import { Toast, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/toast';
import { useLocation } from 'react-router';
import { mainSocket } from '../../utils/sockets';
import { useCookies } from 'react-cookie';

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector(state => state.feed);
    const feedRef = useRef([]);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(null);
    const curPath = useLocation()?.pathname;
    const [{ token: authToken }] = useCookies('token');
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


    const fetchOnlineSocketUsers = (data) => {
        // emit 'getOnlineUsers' event
        feedRef.current = data;
        const userIds = data?.map(el => el._id);
        socket.emit('getOnlineUsers', userIds);
    }

    const handleMainSocket = () => {

        // listen for live users
        socket.on(ONLINE_USERS, (liveUserIds) => {
            // update feed users for online
            const liveUsersSet = new Set([...liveUserIds]);
            const liveUsers = feedRef?.current?.map((user) => liveUsersSet.has(user._id) ? { ...user, isOnline: true } : user);
            dispatch(addFeed(liveUsers));
        });

        // listen for user online event
        socket.on(USER_ONLINE, ({ userId }) => {
            // is user in current feed
            const isInFeed = feedRef.current?.find(el => el._id === userId);
            if (isInFeed) {
                const updatedFeed = feedRef.current?.map(el => (el._id === isInFeed._id) ? { ...el, isOnline: true } : el);
                dispatch(addFeed(updatedFeed));
                feedRef.current = updatedFeed;
            }
        })

        // listen for user offline event
        socket.on(USER_OFFLINE, ({ userId }) => {
            // is user in current feed
            dispatch(addFeed((feedRef.current?.map(user => user._id === userId ? { ...user, isOnline: false } : user))));
        })

        // listen new notifications 
        socket.on(NEW_NOTIFICATION, (payload) => {
            // if current user get new request refresh
            if (payload?.type === NEW_REQUEST) {
                getFeed();
            }
        });
    }

    useEffect(() => {
        handleMainSocket();
        getFeed();

        return () => {
            [ONLINE_USERS, USER_ONLINE, USER_OFFLINE].forEach(el => socket.off(el));
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