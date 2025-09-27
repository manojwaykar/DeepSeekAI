import { useAuth, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { createContext, useContext } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { useEffect } from "react";

export const AppContext = createContext();

export const useAppContext = ()=>{
    return useContext(AppContext)
}

export const AppContextProvider= ({children})=>{
    const {user} = useUser();
    const { getToken } = useAuth();
    const API = "https://deepseekai-backend-vwcv.onrender.com/api/v1/deepseekai"

    const [chats, setChats]= useState([]);
    const [selectedChats, setSelectedChats] = useState(null);

    const createNewChat = async()=>{
        try {
            if(!user) return null;
            const token = await getToken();

            await axios.post(`${API}/chats`, {}, {headers:{
                Authorization : `Bearer ${token}`
            }})

            fetchUsersChats();

        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchUsersChats = async()=>{
        try {
            const token = await getToken();
            const { data } = await axios.get(`${API}/chats`, {headers:{
                Authorization : `Bearer ${token}`
            }});


            if(data.success){
                console.log(data.chats);
                setChats(data.chats);

                if(data.chats.length === 0){
                    await createNewChat();
                    return fetchUsersChats();
                } else {
                    data.chats.sort((a, b)=> new Date(b.updatedAt) - new Date(a.updatedAt));

                    setSelectedChats(data.chats[0]);
                    console.log(data.chats[0]);
                }

            } else {
                toast.error( "Failed to Load chats" )
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(user){
            fetchUsersChats();
        }
    }, [user])

    const value = {
        user,
        chats,
        setChats,
        setSelectedChats,
        selectedChats,
        fetchUsersChats,
        createNewChat
    }

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}