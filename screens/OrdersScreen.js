import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import Order from '../components/Order';
import { fetchOrders } from '../store/actions/order';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders)

    const fetchOrderCommon = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await dispatch(fetchOrders());
        } catch (err) {
            console.log(err);
        }
        setIsRefreshing(false);
    }, [setIsRefreshing, dispatch])

    useEffect(() => {
        setIsLoading(true);
        fetchOrderCommon().then(() => setIsLoading(false)).catch(err => {
            console.log(err);
            setIsLoading(false);
        })
    }, []);

    const renderOrders = order => {
        return <Order id={order.item.id} customerName={order.item.customerName} email={order.item.email} mobileNumber={order.item.mobileNumber} address={order.item.address}
            totalPrice={order.item.totalPrice} date={order.item.date} images={order.item.images} delivered={order.item.delivered} />;
    }

    if (isLoading) {
        return <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    }

    return (
        <FlatList onRefresh={fetchOrderCommon} refreshing={isRefreshing} data={orders} 
        keyExtractor={(order, index) => order.id} renderItem={renderOrders} />
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default OrdersScreen;