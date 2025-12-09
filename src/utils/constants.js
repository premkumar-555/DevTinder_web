const BASE_URL =
  location.hostname === "localhost" ? "http://localhost:3000" : "/api";

const AUTH_URL = `${BASE_URL}/auth`;
const PROFILE_URL = `${BASE_URL}/profile`;
const USER_URL = `${BASE_URL}/user`;
const REQUEST_URL = `${BASE_URL}/request`;

export { AUTH_URL, PROFILE_URL, USER_URL, REQUEST_URL };
