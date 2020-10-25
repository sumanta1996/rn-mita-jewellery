import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import NotificationCard from '../components/NotificationCard';
import { getNotifications, setNotificationRead } from '../store/actions/notifications';

const NotificationScreen = props => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const notifications = useSelector(state => state.notification.notifications);
    const dispatch = useDispatch();
    if(notifications.length === 0) {
        return (
            <View style={styles.centered}>
            <Text>No new notification to show.</Text>
        </View>
        )
    }

    const navigateToOrdersHandler = (orderId, id) => {
        dispatch(setNotificationRead(id));
        props.navigation.navigate('Orders', {
            doFetch: true,
            orderId: orderId
        });
    }

    const notificationHandler = itemData => {
        return <NotificationCard body={itemData.item.body} title={itemData.item.title} read={itemData.item.read} 
        orderTime={itemData.item.orderTime} url={itemData.item.url} onPress={navigateToOrdersHandler.bind(this, itemData.item.orderId, itemData.item.id)} />
    } 

    const refreshHandler = async () => {
        setIsRefreshing(true);
        await dispatch(getNotifications());
        setIsRefreshing(false);
    }

    return (
        <View style={{margin: 5}}>
            <FlatList refreshing={isRefreshing} onRefresh={refreshHandler} data={notifications} renderItem={notificationHandler} keyExtractor={item => item.id} />
        </View>)
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NotificationScreen;