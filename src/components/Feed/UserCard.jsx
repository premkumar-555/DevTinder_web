import React from 'react'

const UserCard = ({ user }) => {
    const { firstName, lastName, about, age, gender, profileUrl } = user;
    console.log('user card value : ', user);
    return (
        <div className="mx-auto card card-lg bg-base-100 w-96 shadow-sm my-6">
            <figure>
                <img
                    src={profileUrl}
                    alt='user profile' />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{`${firstName} ${lastName}`}</h2>
                {age && gender && <p>{age + ', ' + gender}</p>}
                <p>{about}</p>
                <div className="card-actions justify-center my-2">
                    <button className="btn btn-warning rounded-full">Ignore</button>
                    <button className="btn btn-secondary rounded-full">Interested</button>
                </div>
            </div>
        </div>
    )
}

export default UserCard;