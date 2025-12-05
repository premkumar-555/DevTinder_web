import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { REQUEST_URL, USER_URL } from '../../utils/constants';
import { addFeed } from '../../redux/feedSlice';
import UserCard from './userCard';
import { Toast, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/toast';
import { useLocation } from 'react-router';

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector(state => state.feed);
    const [loading, setLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(null);
    const curPath = useLocation()?.pathname;

    const getFeed = async () => {
        setLoading(true);
        try {
            const res = await axios.get(USER_URL + '/feed', { withCredentials: true });
            if (res?.data?.data) {
                dispatch(addFeed(res?.data?.data));
            }
        } catch (err) {
            console.console.error(err);
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
            const { data: { message } } = await axios.post(REQUEST_URL + `/send/${status}/${userId}`, {}, { withCredentials: true });
            if (message) {
                if (status === 'interested') {
                    Toast(message, { type: TOAST_SUCCESS });
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

    useEffect(() => {
        getFeed();
    }, [])

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