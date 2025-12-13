import React from 'react'
import { useParams } from 'react-router'

const ChatBox = () => {
    const { userId } = useParams()
    return (
        <div className='mx-auto w-1/2 h-9/12'>
            <h1 className='text-xl font-bold px-4 py-2 rounded-full'>Chat box</h1>
            <div className='w-full h-full border border-purple-400 rounded-xl bg-cyan-400 p-5'>
                <div className='w-full border-2 border-none h-85/100 rounded-sm'>
                    <div className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS chat bubble component"
                                    src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                />
                            </div>
                        </div>
                        <div className="chat-header text-black">
                            Obi-Wan Kenobi
                            <time className="text-xs text-black">12:45</time>
                        </div>
                        <div className="chat-bubble">You were the Chosen One!</div>
                        <div className="chat-footer text-black">Delivered</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS chat bubble component"
                                    src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                />
                            </div>
                        </div>
                        <div className="chat-header">
                            Anakin
                            <time className="text-xs opacity-50">12:46</time>
                        </div>
                        <div className="chat-bubble">I hate you!</div>
                        <div className="chat-footer text-black">Seen at 12:46</div>
                    </div></div>
                <div className='w-full border-base-100 h-15 mt-5 rounded-sm flex items-center justify-center'>
                    <input type="text" placeholder="Type here" className="input w-90/100" />
                    <button class="btn btn-primary self-center mx-2">Send
                    </button>
                </div>
            </div>
        </div >
    )
}

export default ChatBox