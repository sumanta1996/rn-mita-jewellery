import Order from "../../models/order";
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export const SET_ORDERS = 'SET_ORDERS';

export const fetchOrders = () => {
    return async dispatch => {
        let response;
        response = await fetch('https://mita-jewellery.firebaseio.com/orders.json', {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error in fetching orders. Please check your internet connectivity!');
        }

        response = await response.json();
        let orders = [];
        for (let key in response) {
            const order = new Order(key, response[key].address, response[key].customerName, response[key].date, response[key].delivered,
                response[key].email, response[key].mobilNum, response[key].totalPrice, response[key].images);
            orders.push(order);
        }
        if(orders.length !== 0 ) {
            orders = orders.reverse();
        }
        dispatch({
            type: SET_ORDERS,
            orders: orders
        })
    }
}

export const setOrderDelivered = orderId => {
    return async dispatch => {
        console.log(orderId, ' Here');
        await fetch(`https://mita-jewellery.firebaseio.com/orders/${orderId}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                delivered: true
            })
        })
    }
}


export const setPushToken = () => {
    return async dispatch => {
        let pushToken;
        let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (statusObj.status !== 'granted') {
            statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        }
        if (statusObj.status !== 'granted') {
            pushToken = null;
        } else {
            pushToken = (await Notifications.getExpoPushTokenAsync()).data;
        }

        const url = 'https://mita-jewellery.firebaseio.com/admin.json';
        try {
            let response = await fetch(url, { method: 'GET' });
            response = await response.json();
            if (response) {
                //Push token is already created
                for (let key in response) { 
                    if (response[key].pushToken !== pushToken) {
                        //Push token is created but device got changed so deleting and creating again
                        await fetch(url, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });
                        await fetch(url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                pushToken: pushToken
                            })
                        });
                        break;
                    }
                }
            } else {
                //response is null which means token is not yyet created.
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        pushToken: pushToken
                    })
                });
            }
        } catch (err) {
            throw new Error(err.message);
        }
    }
}