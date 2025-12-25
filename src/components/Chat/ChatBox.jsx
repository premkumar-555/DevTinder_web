import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { mainSocket } from '../../utils/sockets';
import ChatMessage from './ChatMessage';
import { useCookies } from 'react-cookie';
import { CHAT_URL, Today } from '../../utils/constants';
import axios from 'axios';
import { groupMessagesByCreatedAt } from '../../utils/dateHelpers';
import { v4 as uuid } from 'uuid';

const ChatBox = () => {
    const { toUserId } = useParams();
    const loggedInUser = useSelector(state => state.user);
    const [newMsg, setNewMsg] = useState('');
    const [messages, setMessages] = useState([]);
    const bottomRef = useRef(null);
    const timerRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [{ token: authToken }] = useCookies('token');
    const [socket, setSocket] = useState(mainSocket(authToken));
    const [joinRoom, receiveMessage, receiveTyping] = ['joinRoom', 'receiveMessage', 'receiveTyping'];

    // handle message input change
    const handleInputChange = (e) => {
        if (socket) {
            socket.emit('typing', toUserId);
        }
        setNewMsg(e.target.value);
    }

    // send new message
    const sendNewMessage = () => {
        if (newMsg.trim() === '') return;
        if (socket) {
            socket.emit('sendMessage', { toUserId, message: newMsg });
        }
        setNewMsg('');
    }

    // fetch chat messages
    const fetchChatMessages = async () => {
        try {
            const response = await axios.post(`${CHAT_URL}/view`, { users: [toUserId] }, {
                withCredentials: true
            });
            if (response.status === 200 && response?.data?.data?.messages) {
                // group messages based on their createAt dates
                const formatedMessages = groupMessagesByCreatedAt(response?.data?.data?.messages);
                setMessages(formatedMessages);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // handle new message insertion
    const handleMsgInsertion = (prevMessages, newMsg) => {
        try {
            // 1. Check today object exists or not
            const toDayIndx = prevMessages?.findIndex((item) => item?.dateInfo === Today);
            if (toDayIndx !== -1) {
                const res = prevMessages?.map((item) => (item?.dateInfo === Today ? {
                    ...item,
                    messages: [...item.messages, newMsg]
                } : item))
                return res;
            } else {
                const res = [...prevMessages, {
                    createAt: newMsg?.createdAt,
                    dateInfo: Today,
                    messages: [newMsg]
                }]
                return res;
            }
        } catch (err) {
            console.error(err);
        }
    }

    const handleSocket = () => {
        // 1. As soon as chatbox loads, create socket connection with server
        socket.connect();
        // 2. Join user socket to chat room 
        socket.emit(joinRoom, toUserId);

        // Lsten for incoming messages
        socket.on(receiveMessage, (message) => {
            console.log('receiveMessage : ', message);
            setMessages((pre) => (handleMsgInsertion(pre, message)));
        });

        // listen errors 
        socket.on('error', (err) => {
            console.error('socket error : ', err);
        })

        // Listen receiveTyping from server
        socket.on(receiveTyping, () => {
            setIsTyping(true);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
                setIsTyping(false);
            }, 1000);
        })
    }

    useEffect(() => {
        handleSocket();
        fetchChatMessages();

        return () => {
            // Disconnect & clear, socket when component unmounts
            socket.disconnect();
        }
    }, [toUserId])



    useEffect(() => {
        if (bottomRef?.current) {
            bottomRef.current.scrollTop = bottomRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className='mx-auto w-1/2 h-9/12'>
            <h1 className='text-xl font-bold px-4 py-2 rounded-full'>Chat box</h1>

            <div className='w-full h-[500px] border border-purple-400 rounded-xl bg-cyan-400 p-5'>
                <div ref={bottomRef} className='w-full h-85/100 rounded-sm overflow-y-auto scroll-smooth'>
                    {messages.length > 0 && messages?.map((item, ind) => (
                        <div key={uuid()} className='w-full'>
                            <p className='text-info text-md font-bold text-center underline my-2'>{item?.dateInfo}</p>
                            {item?.messages?.length > 0 && item?.messages.map((msg, ind) => (
                                <ChatMessage key={uuid()} message={msg} loggedInUser={loggedInUser} />
                            ))}
                        </div>
                    ))}
                </div>

                <span className={`loading loading-dots loading-md text-black mt-1 ${isTyping ? 'visible' : 'invisible'}`} />
                <div className='w-full border-base-100 h-15 rounded-sm flex items-center justify-center'>
                    <input value={newMsg} onChange={(e) => handleInputChange(e)} type="text" placeholder="Type here" className="input w-90/100" />
                    <button className="btn btn-primary self-center mx-2" onClick={sendNewMessage}>Send
                    </button>
                </div>
            </div>
        </div >
    )
}

export default ChatBox