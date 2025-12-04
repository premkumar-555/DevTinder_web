import React from 'react'

const UserCard = ({ user, curPath }) => {
    const { firstName, lastName, about, age, gender, profileUrl } = user;

    return (
        <div className="h-full mx-auto card card-lg bg-base-100 w-96 shadow-sm">
            <figure>
                <img className='w-full h-75 object-cover'
                    src={profileUrl}
                    alt='user profile' />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
                {age && gender && <p>{age + ', ' + gender}</p>}
                <p>{about}</p>
                {!(curPath && curPath?.includes('profile')) && <div className="card-actions justify-center my-2">
                    <button className="btn btn-warning rounded-full">Ignore</button>
                    <button className="btn btn-secondary rounded-full">Interested</button>
                </div>}

            </div>
        </div>
    )
}

export default UserCard;