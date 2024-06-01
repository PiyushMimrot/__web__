import React, { useEffect } from "react";
import { useState } from "react";
import { Chat } from "./chat.js";



const useFriendsList = () => {
    const [friends, setFriends] = useState(null);
    useEffect(() => {
        (async () => {
            // const data = await response.json();
            // setFriends(data);
        })()
    },[]);
    return {friends};
}



type ChatElementProps = {
    name: string,
    message: string,
}

const ChatElement = ({name,message}:ChatElementProps) => {
    return (
        <div>
           <p>Name:{name} </p>
           <p>Message :{message}</p>
        </div>
    );
}


const FriendsList = () => {

    const [friends, setFriends] = useState([]);

    return (
        <div className="friends-list">
        {friends.map((friend) => (
            <ChatElement name="hello" message="Hai" />
        ))}
        </div>
    );
}


export {FriendsList}
