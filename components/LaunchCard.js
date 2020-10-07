import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableNativeFeedback, ImageBackground, TouchableOpacity, ActivityIndicator,
    Alert, NativeModules, LayoutAnimation
} from 'react-native';
import { Ionicons, Entypo } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useDispatch } from 'react-redux';
import { deleteContent } from '../store/actions/admin';

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);

const LaunchCard = props => {
    const dispatch = useDispatch();
    const [enableDelete, setEnableDelete] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(150);

    const deleteHandler = async () => {
        setIsReload(true);
        try {
            await dispatch(deleteContent(props.productId));
        } catch (err) {
            Alert.alert('Error', err.message, [{ text: 'Okay' }]);
        }
        setIsReload(false);
    }

    const longPressHandler = () => {
        if (props.deleteFeature) {
            LayoutAnimation.spring();
            setWidth(165);
            setHeight(165);
            setEnableDelete(true);
        }
    }

    const cancelHandler = () => {
        LayoutAnimation.spring();
        setWidth(150);
        setHeight(150);
        setEnableDelete(false);
    }

    return (
        <View style={{ overflow: 'hidden', borderRadius: 10 }}>
            <TouchableNativeFeedback onPress={props.onPress} onLongPress={longPressHandler}>
                <View style={{...styles.summary, width: width, height: height}}>
                    <ImageBackground source={{ uri: props.uri }} style={styles.image} >
                        <View style={styles.titleContainer}>
                            <Text style={styles.text}>{props.label}</Text>
                        </View>
                    </ImageBackground>
                    {enableDelete ?
                        <View style={{ width: width, height: 100, backgroundColor: 'rgba(255, 0, 0, 0.2)', zIndex: 20 }}>
                            <TouchableOpacity activeOpacity={0.8} style={styles.buttonContainer}>
                                {isReload ? <ActivityIndicator size="small" color={Colors.primary} /> :
                                    <Ionicons name="md-trash" color="black" size={30} onPress={deleteHandler} />}
                                <Entypo name="cross" color={Colors.primary} size={30} onPress={cancelHandler} />
                            </TouchableOpacity>
                        </View>
                        : null}
                </View>
            </TouchableNativeFeedback>
        </View>
    )
}



const styles = StyleSheet.create({
    summary: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 15,
        overflow: 'hidden',
    },
    text: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        color: 'white'
    },
    image: {
        justifyContent: 'flex-end',
        width: '100%',
        height: '100%'
    },
    titleContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        paddingVertical: 5,
        paddingHorizontal: 12,
        alignItems: 'center'
    },
    button: {
        width: 30,
        height: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 60,
        justifyContent: 'space-around',
        alignItems: 'center'
    }
})

export default LaunchCard;