import { FETCH_NOTIFICATIONS, SET_NONEW_NOTIFICATION, SET_READ } from "../actions/notifications"

const initialState = {
    notifications: [],
    newNotifications: 0
}

export default (state = initialState, action) => {
    switch(action.type) {
        case FETCH_NOTIFICATIONS: 
            return {
                notifications: action.notifications,
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