import {
  AUTH_LOCAL_ROLE,
  AUTH_ROLE,
  AUTH_SESSION_TOKEN,
  AUTH_REFRESH_TOKEN
} from "../../../constants/tokenKey";
import Cookies from "js-cookie";

export function useToken() {
  return {
    setSessionToken(token) {
      Cookies.set(AUTH_SESSION_TOKEN, token, { expires: 36500 });
    },
    getSessionToken() {
      return Cookies.get(AUTH_SESSION_TOKEN);
    },
    removeSessionToken() {
      Cookies.remove(AUTH_SESSION_TOKEN);
    },
    hasSessionToken() {
      const token = Cookies.get(AUTH_SESSION_TOKEN);
      if (!token) return false;
      return true;
    },
    setRefreshToken(token) {
      Cookies.set(AUTH_REFRESH_TOKEN, token, { expires: 36500 });
    },

    getRefreshToken() {
      return Cookies.get(AUTH_REFRESH_TOKEN);
    },
    removeRefreshToken() {
      Cookies.remove(AUTH_REFRESH_TOKEN);
    },
    hasRefreshToken() {
      const token = Cookies.get(AUTH_REFRESH_TOKEN);
      if (!token) return false;
      return true;
    },

    setRole(role) {
      Cookies.set(AUTH_ROLE, role, { expires: 36500 });
    },
    getRole() {
      return Cookies.get(AUTH_ROLE);
    },
    setUserRole(UserRole) {
      localStorage.setItem(AUTH_LOCAL_ROLE, UserRole, { expires: 36500 });
    },
  };
}
