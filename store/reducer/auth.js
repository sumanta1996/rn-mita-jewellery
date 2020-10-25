import { LOGIN, SHOULD_UPDATE, LOGOUT } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    shouldUpdate: true
}

export default (state = initialState, action) => {
    
    switch(action.type) {
        case LOGIN: 
            return {
                token: action.token,
                userId: action.userId
            }
        case LOGOUT: return initialState;
        case SHOULD_UPDATE: 
            return {
                ...state,
                shouldUpdate: action.shouldUpdate
            }
        default: return state;
    }
}