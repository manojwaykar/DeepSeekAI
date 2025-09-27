import { useState } from "react"
import { assets } from "./assets/assets";
import "./App.css"
import SideBar from "../components/SideBar";
import PromptBox from "../components/PromptBox";
import Message from "../components/Message";
import { useEffect } from "react";
import { useRef } from "react";
import { useAppContext } from "../context/AppContext"; 

function App() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChats } = useAppContext();
  const containerRef = useRef(null);

  useEffect(()=>{
    if(selectedChats){
      setMessages(selectedChats.messages);
    }
  }, [selectedChats])

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [messages, isLoading])  

  return (
    <>
      <div className="flex h-screen">
        <SideBar expand={expand} setExpand={setExpand}/>
        <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8 bg-[#292a2d] text-white relative">
          <div className="md:hidden absolute px-4 top-6 flex items-center justify-between w-full">
            <img className="rotate-180" onClick={()=>{expand ? setExpand(false): setExpand(true)}} loading="lazy" src={assets.menu_icon} alt=""/>
            <img className="opacity-70" loading="lazy" src={assets.chat_icon} alt=""/>
          </div>

          {messages.length === 0 ? 
          (<>
            <div className="flex items-center gap-3">
              <img src={assets.logo_icon} alt="" className="h-16"/>
              <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
            </div>
            <p className="text-sm mt-2">How can I help you today?</p>
          </>) : 
          (
          <div ref={containerRef} className="relative flex flex-col items-center justify-center w-full mt-20 max-h-screen overflow-y-auto">
            <p className="fixed top-8 border border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">{selectedChats.name}</p>
            {messages.map((msg, index)=>(
              <Message key={index} role={msg.role} content={msg.content}/>
            ))}
          </div>
          )
          }
          <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>
          <p className="text-xs absolute bottom-1 text-gray-500">AI-generated, for referance only</p>
        </div>
      </div>
    </>
  )
}

export default App;
