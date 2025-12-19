import { io } from "socket.io-client";
import { SOCKET_URL } from "./constants";
import { getCookie } from "./cookies";

// socket connection configs
const socketConfigOptions = {
  autoConnect: false,
  auth: {
    token: "",
  },
};

// Handle dynamic config options for cloud host
if (location.hostname !== "localhost") {
  socketConfigOptions.path = "/api/socket.io/";
}

// socket client creator
const createSocket = (url, token) => {
  socketConfigOptions.auth.token = token;
  return io(url, socketConfigOptions);
};

// Main namespace
export const mainSocket = (token) => createSocket(`${SOCKET_URL}/`, token);

// Request namespace
export const requestSocket = (token) =>
  createSocket(`${SOCKET_URL}/requests`, token);
