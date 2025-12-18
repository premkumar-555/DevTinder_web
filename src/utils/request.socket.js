import { io } from "socket.io-client";
import { BASE_URL } from "./constants";
let reqSocket = null;

export const createRequestSocket = (authToken) => {
  // using autoConnect false to have control over connection
  if (!reqSocket) {
    // on local system
    if (location.hostname === "localhost") {
      reqSocket = io(`${BASE_URL}/requests`, {
        auth: {
          token: authToken,
        },
        autoConnect: false,
      });
    }
    // on cloud server platform
    else {
      reqSocket = io("/", {
        path: "/api/socket.io/requests",
        auth: {
          token: authToken,
        },
        autoConnect: false,
      });
    }
  }
  return reqSocket;
};

export const disconnectRequestSocket = () => {
  if (reqSocket) {
    reqSocket.disconnect();
    reqSocket = null;
  }
};
