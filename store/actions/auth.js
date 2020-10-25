import { AsyncStorage } from "react-native";

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SHOULD_UPDATE = 'SHOULD_UPDATE';

export const login = (email, password) => {
    return async dispatch => {
        let response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBzpmGpErQqjFeR04n5hFnTT0f8qa-WSW0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        });
        if (!response.ok) {
            const errData = await response.json();
            let message = 'Something went wrong!'
            if (errData.error.message === 'EMAIL_NOT_FOUND') {
                message = 'Please enter a valid email address.';
            } else if (errData.error.message === 'INVALID_PASSWORD') {
                message = 'Please enter a valid password.';
            } else if (errData.error.message === 'USER_DISABLED') {
                message = 'Contact your Admin. Your account is deactivated.'
            }
            throw new Error(message);
        }
        const resData = await response.json();
        //Change it now it's in seconds
        const tokenExpiry = new Date(new Date().getTime() + (+resData.expiresIn) * 1000);
        saveToStorage(resData.idToken, resData.localId, resData.refreshToken, tokenExpiry);

        dispatch({
            type: LOGIN,
            token: resData.idToken,
            userId: resData.localId
        });
    }
}

export const refreshAuthentication = refreshToken => {
    return async dispatch => {
        let response = await fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyBzpmGpErQqjFeR04n5hFnTT0f8qa-WSW0', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`
        });
        if (!response.ok) {
            const errData = await response.json();
            console.log('Error: ', errData);
            let message = 'Something went wrong!'
            if (errData.error.message === 'TOKEN_EXPIRED') {
                message = 'Token Expired. Login with email and password to continue';
            } else if (errData.error.message === 'USER_DISABLED') {
                message = 'User Account got disabled. Contact your admin.';
            } else if (errData.error.message === 'USER_NOT_FOUND') {
                message = 'User not found. Login again.'
            }
            throw new Error(message);
        }
        const resData = await response.json();
        //Change it now it's in seconds
        const tokenExpiry = new Date(new Date().getTime() + (+resData.expires_in) * 1000);
        AsyncStorage.removeItem('userData');
        saveToStorage(resData.id_token, resData.user_id, resData.refresh_token, tokenExpiry);

        dispatch({
            type: LOGIN,
            token: resData.id_token,
            userId: resData.user_id
        });
    }
}

export const logout = () => {
    return async dispatch => {
        AsyncStorage.removeItem('userData');
        dispatch({
            type: LOGOUT,
        });
    }
}

export const shouldUpdateHandler = shouldUpdate => {
    return {
        type: SHOULD_UPDATE,
        shouldUpdate: shouldUpdate
    }
} 

const saveToStorage = (token, userId, refreshToken, expiresIn) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        refreshToken: refreshToken,
        expiresIn: expiresIn.toISOString()
    }))
}

