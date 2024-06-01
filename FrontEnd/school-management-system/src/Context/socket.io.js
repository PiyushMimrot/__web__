import socketIO from "socket.io-client";
import { SERVER } from "../config";
const ENDPOINT = SERVER;
// const socket = socketIO(ENDPOINT);

export const InitiateSocketConnection = (allChats, setallChats) => {
  return ;
  socket.on("connect", () => {
    console.log("connected");
  });
  //   socket.connect();
  socket.on("welcome", (ms) => {
    console.log(ms);
  });

  socket.on("groupmessageRecevied", (received) => {
    console.log(received);
    console.log(allChats);
    setallChats([...allChats, received]);
  });
};

export const DisconnectSocketConnection = () => {
  socket.disconnect();
};

export const JoinClassGroup = (groupid) => {
  socket.emit("joinClassGroup", groupid);
};

export const SendGroupClassMessage = (message) => {
  socket.emit("groupmessageSend", message);
};
