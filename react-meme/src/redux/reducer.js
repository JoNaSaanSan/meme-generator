import { LOGIN_USER } from './action';

// Redux reducer to get state of signed in user
const initialState = {
    user: {username: '', email: '', usertoken: '', isSignedIn: false }
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                user: action.payload
            }
        default:
            return state;
    }
}

export default rootReducer;