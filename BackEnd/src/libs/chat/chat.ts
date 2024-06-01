import { Socket } from "socket.io";

const Events = {
    getFriendsList: 'get friends',
} as const;


const getFriendsList = (socket:Socket) => {
    socket.emit(Events.getFriendsList,{"Hello":"World"});
}


export {Events,getFriendsList}

