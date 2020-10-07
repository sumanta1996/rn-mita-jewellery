import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import LaunchCard from '../components/LaunchCard';
import { setPushToken } from '../store/actions/order';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { logout } from '../store/actions/auth';

const LaunchScreen = props => {
    const dispatch = useDispatch();
    const logoutHandler = useCallback(() => {
        dispatch(logout());
    });

    useEffect(() => {
        dispatch(setPushToken());
        props.navigation.setParams({
            logout: logoutHandler
        });
    }, []);

    return (
        <View style={styles.screen}>
            <View style={{ flexDirection: 'row' }}>
                <LaunchCard uri="https://us.123rf.com/450wm/vectorv/vectorv1904/vectorv190409058/123475150-white-cloud-upload-icon-isolated-on-black-background-vector-illustration.jpg?ver=6" label="Upload Content" onPress={() => props.navigation.navigate('Admin')} onLongPress={() => { }} />
                <LaunchCard uri="https://icon-library.com/images/managing-icon/managing-icon-11.jpg" label="Manage Products" onPress={() => props.navigation.navigate('Products')} onLongPress={() => { }} />
            </View>
            <LaunchCard uri="https://cdn.pixabay.com/photo/2016/12/21/16/34/shopping-cart-1923313_1280.png" label="Orders" onPress={() => props.navigation.navigate('Orders')} onLongPress={() => { }} />
        </View>
    )
}

LaunchScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Mita Jewellery',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
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
    }
});

export default LaunchScreen;