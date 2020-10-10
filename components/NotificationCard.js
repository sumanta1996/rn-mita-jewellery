import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const NotificationCard = props => {
    const [readStatus, setReadStatus] = useState(props.read);
 
    const onPressHandler = () => {
        if(!readStatus) {
            setReadStatus(true);
        }
        props.onPress();
    }
    return (
        <TouchableOpacity delayPressIn={0} onPress={onPressHandler}>
            <View style={readStatus ? styles.cardElevationless : styles.cardElevationMore}>
                <View style={styles.contentContainer}>
                    <View style={{width: '80%'}}>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text>{props.body}</Text>
                        </View>
                        <View style={styles.dateStyle}>
                            <Text>{(new Date(props.orderTime)).toDateString()}</Text>
                        </View>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: props.url}} style={styles.image} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardElevationMore: {
        width: '100%',
        height: 100,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 10,
        backgroundColor: '#FAEBD7',
        overflow: 'hidden',
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10
    },
    cardElevationless: {
        width: '100%',
        height: 100,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: 'hidden',
        marginBottom: 10
    },
    textContainer: {
        marginTop: 2,
        marginHorizontal: 10,
        marginBottom: 2,
        height: 70
    },
    title: {
        fontSize: 18,
        fontFamily: 'open-sans-bold',
        marginBottom: 2
    },
    dateStyle: {
        marginHorizontal: 10,
        marginBottom: 2,
        height: 20,
        justifyContent: 'flex-end'
    },
    contentContainer: {
        flexDirection: 'row'
    },
    image: {
        width: 50,
        height: 50,
    },
    imageContainer: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NotificationCard;