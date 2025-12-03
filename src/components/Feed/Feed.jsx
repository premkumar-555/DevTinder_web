import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { userUrl } from '../../utils/constants';
import { addFeed } from '../../redux/feedSlice';
import UserCard from './userCard';

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector(state => state.feed);

    const getFeed = async () => {
        try {
            const res = await axios.get(userUrl + '/feed', { withCredentials: true });
            console.log('res?.data?.data :', res?.data?.data);
            if (res?.data?.data) {
                dispatch(addFeed(res?.data?.data));
            }
            setTimeout(() => {
                console.log('feed :', feed);
            }, 2000);
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
                    feed.map((el, ind) => <UserCard user={el} id={ind} />)
                ) : null
            }
        </>
    )
}

export default Feed