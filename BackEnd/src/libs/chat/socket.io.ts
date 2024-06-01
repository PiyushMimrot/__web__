import http from 'http';
import { Server } from 'socket.io';

const initWithSocketIO = (app: any) => {
    const server = http.createServer(app);
    const io = new Server(server,{cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }});

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        io.on('connection', (socket) => {
            socket.on('chat message', (msg) => {
              io.emit('chat message', msg);
            });
        });
    });
    return server 
}

export {initWithSocketIO}

