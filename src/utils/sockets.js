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
const getSocketUrl = (namespace) => {
  if (location.hostname !== "localhost") {
    socketConfigOptions.path = "/api/socket.io/";
  }
};

// socket client creator
const createSocket = (namespace, token) => {
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
  return io(socketUrl, socketConfigOptions);
};

// Main namespace
export const mainSocket = (token) => createSocket("", token);

// Request namespace
export const requestSocket = (token) => createSocket("requests", token);
