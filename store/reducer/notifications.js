import { FETCH_NOTIFICATIONS, SET_NEW_NOTIFICATION, SET_NONEW_NOTIFICATION, SET_READ } from "../actions/notifications"

const initialState = {
    notifications: [],
    newNotifications: 0
}

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_NOTIFICATIONS: 
            return {
                ...state,
                notifications: action.notifications
            }
        case SET_NEW_NOTIFICATION: 
            return {
                ...state,
                newNotifications: action.newNotifications
            }
        case SET_NONEW_NOTIFICATION: 
            return {
                ...state,
                newNotifications: 0
            }
        case SET_READ: 
            return {
                ...state,
                notifications: action.notifications
            }
        default: return state
    }
}