import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import AdminReducer from './store/reducer/admin';
import OrderReducer from './store/reducer/order';
import NotificationReducer from './store/reducer/notifications';
import firebase from 'firebase';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    }
  }
})


const fetchFonts = async () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
  })
};

const config = {
  apiKey: "AIzaSyBzpmGpErQqjFeR04n5hFnTT0f8qa-WSW0",
  authDomain: "mita-jewellery.firebaseapp.com",
  databaseURL: "https://mita-jewellery.firebaseio.com",
  storageBucket: "mita-jewellery.appspot.com"
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  const rootReducer = combineReducers({
    admin: AdminReducer,
    orders: OrderReducer,
    notification: NotificationReducer
  });

  const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

  if (!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} onError={err => console.log(err)} />
  }

  return <Provider store={store}><AppNavigator /></Provider>
}
