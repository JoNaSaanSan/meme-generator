// Redux action to authenticate user
export const LOGIN_USER = "LOGIN_USER";
export function authenticateUser(payload) {
      return { type: LOGIN_USER, payload };
}