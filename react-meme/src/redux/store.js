import {createStore} from 'redux';
import rootReducer from './reducer';

// Redux: Handle store
const store = createStore(rootReducer);

export default store;
