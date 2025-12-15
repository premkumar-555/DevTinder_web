import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  const socket = io(BASE_URL);
  return socket;
};
