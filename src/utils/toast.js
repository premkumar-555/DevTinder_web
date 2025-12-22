import { toast } from "react-toastify";

export const Toast = (message, { type, position, autoClose }) => {
  return !(message && type)
    ? null
    : toast(message, {
        position: position || "bottom-right",
        type: type,
        autoClose: autoClose || 2000,
      });
};

export const TOAST_SUCCESS = "success";

export const TOAST_ERROR = "error";

export const TOAST_WARNING = "warning";
