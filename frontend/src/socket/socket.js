import { io } from "socket.io-client";
import { API_URL_ROOT } from "../config";

const socket = io(API_URL_ROOT, {
    transports: ["websocket"],
    autoConnect: true,
});

export default socket;
