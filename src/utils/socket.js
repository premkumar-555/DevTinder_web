import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
let socket = null;

export const createSocket = (authToken) => {
  if (!authToken) {
    return;
  }
  // using autoConnect false to have control over connection
  if (!socket) {
    // on local system
    if (location.hostname === "localhost") {
      socket = io(BASE_URL, {
        auth: {
          token: authToken,
        },
        autoConnect: false,
      });
    }
    // on cloud server platform BASE_URL : backend server url+port
    else {
      socket = io("/api", {
        path: "/socket.io/",
        auth: {
          token: authToken,
        },
        autoConnect: false,
      });
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    return null;
  }
};
