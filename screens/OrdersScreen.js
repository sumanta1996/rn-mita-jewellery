import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import Order from '../components/Order';
import { fetchOrders, fetchSingleOrder } from '../store/actions/order';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders.orders);
    //This parameter is used for understanding whether fetch single order or all orders. doFetch: true then fetch order with orderId


    const fetchOrderCommon = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await dispatch(fetchOrders());
        } catch (err) {
            console.log(err);
        }
        setIsRefreshing(false);
    }, [setIsRefreshing, dispatch]);

    const fetchSingleOrderData = useCallback(async orderId => {
        setIsRefreshing(true);
        try{
            await dispatch(fetchSingleOrder(orderId));
        }catch(err) {

        }
        setIsRefreshing(false);
    }, [setIsRefreshing, dispatch]);

    useEffect(() => {
        setIsLoading(true);
        //console.log(props.navigation.getParam('doFetch'));
        if(props.navigation.getParam('doFetch')) {
            const orderId = props.navigation.getParam('orderId');
            //console.log(props.navigation.getParam('orderId'))
            fetchSingleOrderData(orderId).then(() => setIsLoading(false)).catch(err => {
                setIsLoading(false);
            })
        }else {
            fetchOrderCommon().then(() => setIsLoading(false)).catch(err => {
                console.log(err);
                setIsLoading(false);
            })
        }
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

    if(orders.length === 0) {
        return <View style={styles.screen}>
            <Text>No orders to fetch.</Text>
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