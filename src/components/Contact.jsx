import React from 'react'

const Contact = () => {
    return (
        <div className="mx-auto card w-100 bg-base-300 card-lg shadow-sm">
            <div className="card-body">
                <h2 className="card-title">Contact details</h2>
                <p>Email: <span className="font-medium">support@devtinder.com</span></p>
                <p className="mt-2">Phone: <span className="font-medium">+91 9876543210</span></p>
                <p className="mt-2">Address: Bengaluru, India</p>
            </div>
        </div>
    )
}

export default Contact