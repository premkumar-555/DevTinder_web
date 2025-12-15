import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
let socket = null;

export const createSocket = (authToken) => {
  if (!authToken) {
    return;
  }
  // using autoConnect false to have control over connection
  if (!socket) {
    socket = io(BASE_URL, {
      auth: {
        token: authToken,
      },
      autoConnect: false,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    return null;
  }
};
