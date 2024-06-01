import io, { Socket } from 'socket.io-client';
import { SERVER } from '../../config.js';


class Chat{
    static socket?:Socket;
    constructor(){
        Chat.socket = io(`${SERVER}`);
    }
    static sendMessage(message:string){
        Chat.socket?.emit('chat message', message);
    }
    static receiveMessage(callback:Function){
        Chat.socket?.on('chat message', function(msg) {
            callback(msg);
        });
    }
    static getFriendsList(){
        Chat.socket?.emit('get friends');
    }
}


export {Chat}