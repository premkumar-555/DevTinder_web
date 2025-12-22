import React from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ChatToastContent = ({ fromUser, message }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/chat/${fromUser?._id?.toString()}`);
        toast.dismiss();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="badge badge-info text-md badge-md mx-0">New message</div>
            <div className='pl-2'>
                <strong className='text-black font-bold text-sm'>{`${fromUser?.firstName} ${fromUser?.lastName}`}</strong>
                <p style={{ margin: "4px 0", color: "#555" }} className='text-sm'>
                    {message?.length > 150 ? `${message?.substring(0, 150)}...` : message}
                </p>
            </div>

            <span className='pl-2'
                onClick={handleRedirect}
                style={{
                    marginTop: "6px",
                    color: "#0b5ed7",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: '14px'
                }}
            >
                Open Chat →
            </span>
        </div>
    );
};

const MessageNotification = ({ fromUser, message }) => {
    toast(
        <ChatToastContent fromUser={fromUser} message={message} />,
        {
            className: "chat-toast",
            position: "bottom-right",
            autoClose: 3000,
        }
    );
}



export default MessageNotification