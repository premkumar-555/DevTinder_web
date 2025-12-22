import React from 'react'

const UserCard = ({ user, curPath, handleRequest, btnLoading }) => {
    const { _id, firstName, lastName, about, age, gender, profileUrl } = user;
    const allowedPathsForBtns = ['/'];
    const [ignored, interested] = ['ignored', 'interested'];

    return (
        <div className="h-full mx-auto card card-lg bg-base-100 w-96 shadow-sm ">
            <figure>
                <img className='w-full h-75 object-cover'
                    src={profileUrl}
                    alt='user profile' />
            </figure>
            <div className="card-body overflow-hidden overflow-ellipsis p-6">
                <h2 className="card-title">{`${firstName} ${lastName}`} {user?.isOnline && (<span className="badge badge-success badge-xs">online</span>)}</h2>
                {age && gender && <p>{age + ', ' + gender}</p>}
                <p>{about && about?.length > 150 ? about?.substring(0, 150) + '...' : about}</p>
                {(allowedPathsForBtns.includes(curPath)) && <div className="card-actions justify-center my-2">
                    <button className="btn btn-warning rounded-full" disabled={btnLoading}
                        onClick={() => { handleRequest(ignored, _id) }}>
                        {(btnLoading === ignored) ? <span className="loading loading-ring loading-md"></span> : "Ignore"}
                    </button>
                    <button className="btn btn-secondary rounded-full" disabled={btnLoading}
                        onClick={() => { handleRequest(interested, _id) }}>
                        {(btnLoading === interested) ? <span className="loading loading-ring loading-md"></span> : "Interested"}
                    </button>
                </div>}

            </div>
        </div>
    )
}

export default UserCard;