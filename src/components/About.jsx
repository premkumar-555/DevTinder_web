import React from 'react'

const About = () => {
    return (
        <div className="hero bg-base-200 ">
            <div className="hero-content flex-col lg:flex-row font-sans">
                <img
                    src='https://plus.unsplash.com/premium_photo-1685086785636-2a1a0e5b591f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGV2ZWxvcGVyfGVufDB8fDB8fHww'
                    className="max-w-sm rounded-lg shadow-2xl"
                />
                <div className='border-2 border-black'>
                    <h1 className="text-3xl font-bold">About Us — DevTinder</h1>
                    <p className="py-6 text-lg font-sans align-justify">
                        DevTinder is a community-driven platform designed to help developers connect, collaborate, and grow together.
                        In today’s fast-moving tech world, developers often struggle to find like-minded people for learning, mentorship, project collaboration, and professional networking.DevTinder solves this by offering a simple and intuitive space where developers can match based on skills, interests, and goals.

                        Whether you're a beginner exploring your first framework or an experienced engineer looking for collaboration partners.
                        <br />
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        DevTinder makes it easy to discover developers who share similar passions. With built-in chat, profile matching, skill tagging, and real-time communication, DevTinder creates meaningful technical connections — fast.

                        At DevTinder, our mission is to bring developers closer and build a supportive tech ecosystem where knowledge is shared, ideas are born, and opportunities grow.
                        We believe great products, startups, and friendships begin with the right connection — and we’re here to make those connections happen.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default About