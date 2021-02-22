export const TOGGLE_SPEECH = "TOGGLE_SPEECH";
export function toggleSpeech(payload) {
      return { type: TOGGLE_SPEECH, payload };
}

// Redux action to authenticate user
export const LOGIN_USER = "LOGIN_USER";
export function authenticateUser(payload) {
      return { type: LOGIN_USER, payload };
}
