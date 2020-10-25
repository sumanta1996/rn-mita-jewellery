import Notification from '../../models/notification';

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS';
export const SET_NEW_NOTIFICATION = 'SET_NEW_NOTIFICATION';
export const SET_NONEW_NOTIFICATION = 'SET_NONEW_NOTIFICATION';
export const SET_READ = 'SET_READ';
const url = 'https://mita-jewellery.firebaseio.com/notifications.json';

export const setNotification = (title, body, orderId) => {
    return async dispatch => {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                read: false,
                orderTime: new Date().toISOString(),
                orderId: orderId
            })
        });
    }
}

export const getNotifications = () => {
    return async (dispatch) => {
        //console.log('Fetching notifications');
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Refresh the page once again!');
        }

        responseData = await response.json();
        let notifications = [];
        let newNotifications = 0;
        for(let key in responseData) {
            if (responseData[key].newNot) {
                newNotifications = newNotifications + 1;
            }
        }
        dispatch({
            type: SET_NEW_NOTIFICATION,
            newNotifications: newNotifications
        });
        for (let key in responseData) {

            /* const responseOrderData = await fetch(`https://mita-jewellery.firebaseio.com/orders/${responseData[key].orderId}.json`, {
                method: 'GET',

            });
            let url = '';
            if (responseOrderData.ok) {
                responseOrderData = await responseOrderData.json();
                url = responseOrderData.images[0].urlArr.url1;
            } */
            if (responseData[key].newNot) {
                newNotifications = newNotifications + 1;
            }
            notifications.push(new Notification(key, responseData[key].body, responseData[key].title, responseData[key].orderId,
                responseData[key].orderTime, responseData[key].read, responseData[key].newNot, responseData[key].imageUrl));
            
        }
        dispatch({
            type: FETCH_NOTIFICATIONS,
            notifications: notifications.reverse()
        })
    }
}

export const setNoNewNotification = () => {
    return async (dispatch, getState) => {
        const notifications = getState().notification.notifications;
        //console.log(notifications);
        dispatch({
            type: SET_NONEW_NOTIFICATION
        });
        notifications.map(async notification => {
            //console.log(notification.id);
            await fetch(`https://mita-jewellery.firebaseio.com/notifications/${notification.id}.json`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newNot: false
                })
            });
        })
    }
}


export const setNotificationRead = id => {
    return async (dispatch, getState) => {
        const response = await fetch(`https://mita-jewellery.firebaseio.com/notifications/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                read: true
            })
        });
        /*let notifications = getState().notification.notifications;
        let setReadNotification = notifications.find(notification => notification.id === id);
        setReadNotification = {
            ...setReadNotification,
            read: true
        };
        const index = notifications.findIndex(notification => notification.id === id);
        notifications[index] = setReadNotification;
        console.log(setReadNotification);
        console.log(index);
        dispatch({
            type: FETCH_NOTIFICATIONS,
            notifications: notifications,
            newNotifications: 0
        }) */

    }
}



