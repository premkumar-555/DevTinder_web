import React from 'react'

const ChatMessage = ({ message, loggedInUser }) => {
    return <>
        {
            (message?.from?._id !== loggedInUser?._id) ? <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src={message?.from?.profileUrl || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"}
                        />
                    </div>
                </div>
                {message?.from?.name && (<div className="chat-header text-black">
                    {message?.from?.name}
                    <time className="text-xs text-black">12:45</time>
                </div>)}

                {message?.message && (<>
                    <div className="chat-bubble">{message?.message}</div>
                    <div className="chat-footer text-black">Delivered</div></>)}
            </div> : message?.from?._id === loggedInUser?._id ?
                <div className="chat chat-end">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS chat bubble component"
                                src={loggedInUser?.profileUrl || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
                            />
                        </div>
                    </div>
                    {loggedInUser && loggedInUser?.firstName && (
                        <div className="chat-header">
                            {loggedInUser?.firstName + " " + loggedInUser?.lastName}
                            <time className="text-xs opacity-50">12:46</time>
                        </div>
                    )}

                    {message?.message && (<>
                        <div className="chat-bubble">{message?.message}</div>
                        <div className="chat-footer text-black">Seen at 12:46</div></>)}

                </div>
                : null
        }
    </>
}


export default ChatMessage;