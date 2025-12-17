const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:3000" : "/api";

// API URLs
const AUTH_URL = `${BASE_URL}/auth`;
const PROFILE_URL = `${BASE_URL}/profile`;
const USER_URL = `${BASE_URL}/user`;
const REQUEST_URL = `${BASE_URL}/request`;
const CHAT_URL = `${BASE_URL}/chat`;

// DATE format timezone
const timezone = "Asia/Kolkata";

export {
  BASE_URL,
  AUTH_URL,
  PROFILE_URL,
  USER_URL,
  REQUEST_URL,
  CHAT_URL,
  timezone,
};
