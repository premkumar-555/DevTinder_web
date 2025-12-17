import React from 'react'
import { formatTime } from '../../utils/dateHelpers';

const ChatMessage = ({ message, loggedInUser }) => {

    return <>
        {
            (message?.fromUser?._id !== loggedInUser?._id) ?
                <div className="chat chat-start">
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="Tailwind CSS chat bubble component"
                                src={message?.fromUser?.profileUrl || "https://img.daisyui.com/images/profile/demo/kenobee@192.webp"}
                            />
                        </div>
                    </div>
                    <div className="chat-header text-black">
                        {`${message?.fromUser?.firstName} ${message?.fromUser?.lastName}`}
                        <time className="text-xs text-black">{formatTime(message?.createdAt)}</time>
                    </div>
                    {message?.message && (<>
                        <div className="chat-bubble">{message?.message}</div></>)}
                </div> : message?.fromUser?._id === loggedInUser?._id ?
                    <div className="chat chat-end">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS chat bubble component"
                                    src={loggedInUser?.profileUrl || "https://img.daisyui.com/images/profile/demo/anakeen@192.webp"}
                                />
                            </div>
                        </div>
                        <div className="chat-header text-black">
                            {loggedInUser?.firstName + " " + loggedInUser?.lastName}
                        </div>
                        <div className="chat-bubble">{message?.message}</div>
                        <div className="chat-footer text-black">{formatTime(message?.createdAt)}</div>
                    </div>
                    : null
        }
    </>
}


export default ChatMessage;