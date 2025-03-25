import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket | null = null;

  public connect(room: string, playerName: string) {
    const serverUrl = 'https://localhost:8000';
    console.log(`Service Connecting to server at: ${serverUrl}`);
    this.socket = io(serverUrl, { transports: ['websocket'], rejectUnauthorized: false });

    this.socket.on('connect', () => {
      console.log(`Socket connected with ID: ${this.socket?.id}`);
      this.socket?.emit('join-room', { room: room, playerName: playerName });
      console.log(`Emitting join-room for room: ${room}, player: ${playerName}`);
    
    })

    this.socket.on('room-info', (data) => {
        console.log("Room info: ", data);
    });

    this.socket.on('game-started', () => {
        console.log("Game started!");
    });

    this.socket.on('error', (message) => {
      console.log("Error message: ", message);
      alert(message);
    });

    this.socket.on("connect_error", (err) => {
      // the reason of the error, for example "xhr poll error"
      console.log("socket connection error: ", err);
  
    });
  }

  public disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }

  public emit(event: string, ...args: any[]) {
    if (this.socket) {
        this.socket.emit(event, ...args);
    }
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
