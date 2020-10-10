import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Button, FlatList } from 'react-native';
import { useDispatch } from 'react-redux';
import Colors from '../constants/Colors';
import { setOrderDelivered } from '../store/actions/order';

const Order = props => {
    const [delivered, setDelivered] = useState(props.delivered);

    const dispatch = useDispatch();
    const imageUrls = [];
    props.images.map(image => {
        imageUrls.push({
            url: image.urlArr.url1,
            price: image.price
        });
    })

    const orderDeliveredHandler = () => {
        dispatch(setOrderDelivered(props.id));
        setDelivered(true);
    }

    return (
        <View style={styles.order}>
            {delivered && <Image source={require('../assets/sold.png')} style={styles.soldImage} />}
            <View style={styles.imageContainer}>
                <FlatList horizontal data={imageUrls} keyExtractor={(item, index) => item.url}
                    renderItem={(itemData) => {
                        return (
                            <View>
                                <Image style={styles.image} source={{ uri: itemData.item.url }} />
                                <View style={styles.textContainer}>
                                    <Text style={{ fontFamily: 'open-sans-bold' }}>&#x20B9; {itemData.item.price}</Text>
                                </View>
                            </View>)
                    }} />
            </View>
            <View style={styles.userDetails}>
                <Text style={styles.header}>USER DETAILS</Text>
                <Text>Customer Name: {props.customerName}</Text>
                <Text>Email ID: {props.email}</Text>
                <Text>Mobile Number: {props.mobileNumber}</Text>
                <Text>Address to be delivered: {props.address}</Text>
                <Text>Total Price: <Text style={{ fontFamily: 'open-sans-bold' }}>&#x20B9; {props.totalPrice}</Text></Text>
                <Text>ORDER PLACED ON: {props.date}</Text>
                <View style={styles.buttonContainer}>
                    <Button title="Order Delivered?" disabled={delivered}
                        onPress={orderDeliveredHandler} color={props.delivered ? '#ccc' : Colors.primary} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    order: {
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        padding: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    userDetails: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20
    },
    header: {
        fontSize: 20,
        fontFamily: 'open-sans-bold',
        color: 'orange'
    },
    imageContainer: {
        flexDirection: 'row',
        margin: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 10
    },
    buttonContainer: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    soldImage: {
        width: 50,
        height: 50,
        position: 'absolute',
        zIndex: 50,
        top: 150,
        left: 5
    },
    textContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Order;