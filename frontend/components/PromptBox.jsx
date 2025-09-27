import React, { useState } from 'react'
import { assets } from '../src/assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const PromptBox = ({isLoading, setIsLoading}) => {
    
    const [prompt, setPrompt] = useState('');
    const { user, chats, setChats, selectedChats, setSelectedChats} = useAppContext();
    const { getToken } = useAuth();

    const handleKeyDown = (e)=>{
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendPrompt(e);
        }
    }

    const sendPrompt = async (e)=>{
        const promptCopy = prompt;

        try {
            e.preventDefault();
            if (!user) return toast.error("Login to send message");
            if(isLoading) return toast.error("Wait for previous prompt response");
            if (!selectedChats?._id) return toast.error("No chat selected");

            setIsLoading(true);
            setPrompt("");

            const userPromot = {
                role : "user",
                content : prompt,
                timestamp : Date.now()
            }

            setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChats._id ? {
                ...chat,
                messages : [...chat.messages, userPromot]
            } : chat))

            setSelectedChats((prev)=>({
                ...prev,
                messages : [...prev.messages, userPromot]
            }))

            const token = await getToken();
            const { data } = await axios.post('https://deepseekai-backend-vwcv.onrender.com/api/v1/deepseekai/chats/prompt', {
                chatId : selectedChats._id,
                content : prompt,
            }, {
                    headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if(data.success){
                setChats((prevChats)=>prevChats.map((chat)=>chat._id === selectedChats._id ? {...chat, messages: [...chat.messages, data.data]} : chat))

                const message = data.chat.content;
                const messageTokens = message.split(" ");
                let assistentMessage = {
                    role : 'assistant',
                    content : "",
                    timestamp : Date.now(),
                }

                setSelectedChats((prev)=>({
                    ...prev,
                    messages : [...prev.messages, assistentMessage]
                }))

                for (let i = 0; i < messageTokens.length; i++) {
                    setTimeout(()=>{
                        assistentMessage.content = messageTokens.slice(0, i+1).join(" ");
                        setSelectedChats((prev)=>{
                            const updatedMessages = [
                                ...prev.messages.slice(0, -1),
                                {...assistentMessage}
                            ]
                            return { ...prev, messages: updatedMessages}
                        })
                    }, i*100)
                    
                }


            } else {
                toast.error(error.response?.data?.error || error.message);
                setPrompt(promptCopy);
            }

        } catch (error) {
            toast.error(error.message);
            setPrompt(promptCopy)
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <form onSubmit={sendPrompt}
     className={`w-full ${selectedChats?.messages.length ? "max-w-3xl" : "max-w-2xl"} bg-[#404045] p-4 rounded-3xl mt-4 transition-all`}>
        <textarea 
        onKeyDown={handleKeyDown}
        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent'
        rows={2}
        placeholder='Message DeepSeek' required
        onChange={(e)=>{
            setPrompt(e.target.value)
        }} value={prompt}/>
        
        <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center gap-2'>
                <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 
                rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                    <img className='h-5' src={assets.deepthink_icon} alt=''/>
                    DeepThink (R1)
                </p>
                <p className='flex items-center gap-2 text-xs border border-gray-300/40 px-2 py-1 
                rounded-full cursor-pointer hover:bg-gray-500/20 transition'>
                    <img className='h-5' src={assets.search_icon} alt=''/>
                    Search
                </p>
            </div>

            <div className='flex items-center gap-2'>
                <img className='w-4 cursor-pointer' src={assets.pin_icon} alt=''/>
                <button className={`${prompt? "bg-indigo-800": "bg-[#71717a]"} rounded-full p-2 cursor-pointer`}>
                    <img className='w-3.5 aspect-square' src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} alt=''/>
                </button>
            </div>
        </div>

        {isLoading && (
        <div className="flex items-center gap-2 mt-2">
          <img className="h-9 w-9 p-1 border border-white/15 rounded-full" src={assets.logo_icon} alt="Logo" />
          <div className="flex gap-1">
            <div className="h-1 w-1 bg-white rounded-full animate-bounce"></div>
            <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-150"></div>
            <div className="h-1 w-1 bg-white rounded-full animate-bounce delay-300"></div>
          </div>
        </div>
      )}

    </form>
  )
}

export default PromptBox;