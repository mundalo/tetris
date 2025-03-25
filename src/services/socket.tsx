import { io, Socket } from "socket.io-client";

class SocketService {
  public socket: Socket;

  public connect(room: string, playerName: string) {
    const serverUrl = `http://localhost:3000/${room}/${playerName}`;
    if (this.socket) {
        this.socket.disconnect();
    }

    this.socket = io(serverUrl);

    this.socket.on('connect', () => {
        console.log("Connected to the server", serverUrl);
    });

    this.socket.on('game-update', (data) => {
        console.log("Game state update: ", data);
    });

    this.socket.on('disconnect', () => {
        console.log("Disconnected from the server");
    });
  }

  public disconnect() {
    if (this.socket) {
        this.socket.disconnect();
    }
  }
  
  public on(event: string, callback: (data: any) => void) {
    if (this.socket) {
        this.socket.on(event, callback);
    }
  }

  public emit(event: string, data: any) {
    if (this.socket) {
        this.socket.emit(event, data);
    }
  }
}

const socketServiceInstance = new SocketService();
export default socketServiceInstance;
