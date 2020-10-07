import { SET_ORDERS } from "../actions/order"

const initialState = {
    orders: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_ORDERS: 
            return {
                ...state,
                orders: action.orders
            }
        default: return state;
    }
}