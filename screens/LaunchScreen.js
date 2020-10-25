import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, connect, useSelector } from 'react-redux';
import LaunchCard from '../components/LaunchCard';
import { setPushToken } from '../store/actions/order';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { logout } from '../store/actions/auth';
import * as Notifications from 'expo-notifications';
import { getNotifications, setNoNewNotification, setNotification } from '../store/actions/notifications';
import NotificationScreen from './NotificationScreen';
import Colors from '../constants/Colors';
import { ActivityIndicator } from 'react-native-paper';

const LaunchScreen = props => {
    const [showNotificationScreen, setShowNotificationScreen] = useState(false);
    const [reload, setReload] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const dispatch = useDispatch();
    const [doRefresh, setDoRefresh] = useState(false);

    const logoutHandler = useCallback(() => {
        dispatch(logout());
    });


    const notificationHandler = async notification => {
        //On incoming notifications just save it in firebase
        await dispatch(getNotifications());
        setDoRefresh(!doRefresh);
        console.log('Notification came');
    }

    const notificationResponseHandler = notification => {
        //For now navigate the notifications to orders.
        //props.navigation.navigate('Orders');
    }

    const setNotificationShowHandler = useCallback(async () => {
        setShowNotificationScreen(!showNotificationScreen)
        setReload(true);
        await dispatch(getNotifications());
        setReload(false);
        await dispatch(setNoNewNotification());
    });

    useEffect(() => {
        props.navigation.setParams({
            notification: setNotificationShowHandler,
            notificationTapped: showNotificationScreen,
            newNotification: props.newNotification,
            doRefresh: doRefresh
        })
    }, [doRefresh, showNotificationScreen, props.newNotification]);

    useEffect(() => {
        //console.log('Mounted Again');
        const willFocusSub = props.navigation.addListener('willFocus', async () => {
            console.log('Got focused');
            await dispatch(getNotifications());
         });

        return () => {
            willFocusSub.remove();
        }
    }, [])


    useEffect(() => {
        dispatch(setPushToken());
        props.navigation.setParams({
            logout: logoutHandler
        });
        const fetchData = async () => {
            //setShowLoader(true);
            try {
                await dispatch(getNotifications());
            }catch(err) {}
            props.navigation.setParams({
                comingFromBackground: false
            })
        }
        fetchData();
        //This gets triggered when notification recieved
        Notifications.addNotificationReceivedListener(notificationHandler);

        //This gets triggered when user tap on notification
        Notifications.addNotificationResponseReceivedListener(notificationResponseHandler);
    }, []);

    if (showNotificationScreen) {
        if (reload) {
            return (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            )
        } else {
            return (
                <NotificationScreen navigation={props.navigation} />
            )
        }
    }

    if(props.navigation.getParam('comingFromBackground')) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <View style={{ flexDirection: 'row' }}>
                <LaunchCard uri="https://us.123rf.com/450wm/vectorv/vectorv1904/vectorv190409058/123475150-white-cloud-upload-icon-isolated-on-black-background-vector-illustration.jpg?ver=6" label="Upload Content" onPress={() => props.navigation.navigate('AdminConsole')} onLongPress={() => { }} />
                <LaunchCard uri="https://icon-library.com/images/managing-icon/managing-icon-11.jpg" label="Manage Products" onPress={() => props.navigation.navigate('Products')} onLongPress={() => { }} />
            </View>
            <LaunchCard uri="https://cdn.pixabay.com/photo/2016/12/21/16/34/shopping-cart-1923313_1280.png" label="Orders" onPress={() => props.navigation.navigate('Orders')} onLongPress={() => { }} />
        </View>
    )
}

LaunchScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('notificationTapped') ? 'Notifications' : 'Mita Jewellery',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <View style={{ marginRight: 20 }}>
                <View style={navData.navigation.getParam('newNotification') > 0 ? styles.textContainer : styles.textContainerTransparent}>
                    <Text style={styles.text}>{navData.navigation.getParam('newNotification') > 0 ? navData.navigation.getParam('newNotification') : null}</Text>
                </View>
                <Item title='Notification' iconName={navData.navigation.getParam('notificationTapped') ? "bell" : "bell-outline"} onPress={() => {
                    navData.navigation.getParam('notification')();
                }} />
            </View>
            <Item title='Create' iconName="logout" onPress={() => {
                navData.navigation.getParam('logout')();
                navData.navigation.navigate('Startup');
            }} />
        </HeaderButtons>
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 10
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        position: 'absolute',
        top: -10,
        left: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainerTransparent: {
        position: 'absolute',
        top: -10,
        left: 2,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 12
    }
});

//I am using connect here because useSelector performs a thorough check on redux value change but connect doesnot so it updates everytime
//value gets updated as conenct performs a shallow check
const mapPropsToState = state => {
    return {
        newNotification: state.notification.newNotifications
    }
}

export default connect(mapPropsToState)(LaunchScreen);