import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { USER_URL } from '../../utils/constants';
import { addFeed } from '../../redux/feedSlice';
import UserCard from './userCard';

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector(state => state.feed);

    const getFeed = async () => {
        try {
            const res = await axios.get(USER_URL + '/feed', { withCredentials: true });
            if (res?.data?.data) {
                dispatch(addFeed(res?.data?.data));
            }
        } catch (err) {
            console.console.error(err);
        }
    }

    useEffect(() => {
        getFeed();
    }, [])

    return (
        <>
            {
                feed ? (
                    <div className='h-screen bg-base-200 py-6'>
                        <div className='h-125'>
                            <UserCard user={feed[0]} />
                        </div>
                    </div>
                ) : null
            }
        </>
    )
}

export default Feed