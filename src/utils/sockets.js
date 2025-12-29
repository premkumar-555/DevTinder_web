import { io } from "socket.io-client";
import { CHAT_SOCKET, SOCKET_URL, MAIN_SOCKET } from "./constants";
// sockets registry
const socketRegistry = new Map();

// socket connection configs
const socketConfigOptions = {
  autoConnect: false,
  auth: {
    token: "",
  },
};

// socket client creator
const createSocket = (namespace, token, socketName) => {
  // Default socket url dynamic for both local/cloud host platforms
  let socketUrl = `${SOCKET_URL}`;
  socketConfigOptions.auth.token = token;
  // Handle socket urls for local or cloud hosts
  // 1. If cloud host, update config path with namespace
  if (location.hostname !== "localhost") {
    // on cloud host socket io runs on www.xyzdomain.com/api/socket.io/
    socketConfigOptions.path = `/api/socket.io/${namespace}`;
  } else {
    socketUrl = `${socketUrl}/${namespace}`;
  }
  if (!socketRegistry.has(socketName)) {
    socketRegistry.set(socketName, io(socketUrl, socketConfigOptions));
  }
  return socketRegistry.get(socketName);
};

// Main namespace
export const mainSocket = (token) => createSocket("", token, MAIN_SOCKET);

// Chat namespace
export const chatSocket = (token) => createSocket("", token, CHAT_SOCKET);
