import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { createSocket, disconnectSocket } from '../../utils/socket';
import ChatMessage from './ChatMessage';
import { useCookies } from 'react-cookie';

const ChatBox = () => {
    const { userId } = useParams();
    const loggedInUser = useSelector(state => state.user);
    const [newMsg, setNewMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const [{ token }] = useCookies(['token']);
    const [socket, setSocket] = useState(createSocket(token));


    // send new message
    const sendNewMessage = () => {
        if (newMsg.trim() === '') return;
        if (socket)
            socket.emit('sendMessage', { toUserId: userId, message: newMsg });
        setNewMsg('');
    }

    useEffect(() => {
        // check for socket init
        if (!loggedInUser) {
            return;
        }
        // As soon as chatbox loads, create socket connection with server

        socket.connect();
        // Emit event to join socket to room
        socket.emit('joinRoom', userId);
        // Listen for incoming messages in the room
        socket.on('receiveMessage', (data) => {
            setMessages((prev) => ([...prev, data]));
        });

        return () => {
            // Disconnect & clear, socket when component unmounts
            disconnectSocket();
        }
    }, []);

    useEffect(() => {
        if (bottomRef?.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='mx-auto w-1/2 h-9/12'>
            <h1 className='text-xl font-bold px-4 py-2 rounded-full'>Chat box</h1>

            <div className='w-full h-[500px] border border-purple-400 rounded-xl bg-cyan-400 p-5'>
                <div ref={bottomRef} className='w-full border-2 border-none h-85/100 rounded-sm overflow-y-auto scroll-smooth'>
                    {messages.length > 0 && messages.map((message, ind) => (
                        <ChatMessage key={ind} message={message} loggedInUser={loggedInUser} />
                    ))}
                </div>
                <div className='w-full border-base-100 h-15 mt-5 rounded-sm flex items-center justify-center'>
                    <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} type="text" placeholder="Type here" className="input w-90/100" />
                    <button className="btn btn-primary self-center mx-2" onClick={sendNewMessage}>Send
                    </button>
                </div>
            </div>
        </div >
    )
}

export default ChatBox