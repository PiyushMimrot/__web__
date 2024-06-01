import React from "react";
import { Chat } from "./chat.js";
import { FriendsList } from "./chat_list.js";

const isInDevelopment = import.meta.env.VITE_ENV === "development";


const ChatScreen = !isInDevelopment?()=><div>Under Development</div>:
() => {
    return (
        <div>
           <FriendsList />
            <input type="text" placeholder="Room ID" />
            <button>Join</button>
                <br/>
            <input type="text" placeholder="Type a message" />
            <button>Send</button>
        </div>
    );
}



export default ChatScreen;
