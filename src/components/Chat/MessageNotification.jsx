import React from 'react'
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { NEW_MESSAGE } from '../../utils/constants'

const ChatToastContent = ({ payload }) => {
    const { type, fromUser: { _id, firstName, lastName }, info } = payload;
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/chat/${_id?.toString()}`);
        toast.dismiss();
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            {type === NEW_MESSAGE && <div className="badge badge-info text-md badge-md mx-0">New message</div>}
            <div className='pl-2'>
                {type === NEW_MESSAGE && <strong className='text-black font-bold text-sm'>{`${firstName} ${lastName}`}</strong>}
                <p style={{ margin: "4px 0", color: "#555" }} className='text-sm'>
                    {info}
                </p>
            </div>

            {!location.pathname.includes(`/chat/${_id}`) && <span className='pl-2'
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
            </span>}
        </div>
    );
};

const MessageNotification = ({ payload }) => {

    if (payload?.type === NEW_MESSAGE) {
        return toast(
            <ChatToastContent payload={payload} />,
            {
                className: "chat-toast",
                position: "bottom-right",
                autoClose: false,
            }
        );
    } else {
        toast(<p style={{ fontSize: '14px' }}>{payload.info}</p>, {
            type: 'info',
            autoClose: 3000,
            position: "bottom-right",
        })
    }
}



export default MessageNotification