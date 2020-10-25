import React, { useEffect, useRef, useState, useCallback } from 'react';
import Colors from '../constants/Colors';
import { ActivityIndicator, View, StyleSheet, AsyncStorage, AppState } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
import { useDispatch, useSelector, connect } from 'react-redux';
import { refreshAuthentication } from '../store/actions/auth';
import * as LocalAuthentication from 'expo-local-authentication';
import { getNotifications } from '../store/actions/notifications';

const StartupScreen = props => {
    const dispatch = useDispatch();
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    let refreshToken;

    const biometricHandler = async () => {
        if (await LocalAuthentication.hasHardwareAsync()) {
            console.log('Biometric enabled');
            if ((await LocalAuthentication.supportedAuthenticationTypesAsync()).length > 0) {
                console.log('Biometric can be utilised');
                if (await LocalAuthentication.isEnrolledAsync()) {
                    //Biometric is configured
                    console.log('Biometric configured');
                    const biometricResponse = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Please Authenticate',
                        cancelLabel: 'Cancel authentication',
                    });
                    if (biometricResponse.success) {
                        props.navigation.navigate('Admin');
                    }
                    if (!biometricResponse.success && biometricResponse.error === 'user_cancel') {
                        props.navigation.navigate('Auth', {
                            error: 'User cancelled it. Please login with email-id and password'
                        });
                    }
                } else {
                    //Biometric is not configured thus provide a message
                    console.log('Biometric not configured');
                    props.navigation.navigate('Admin');
                }
            }
        } else {
            props.navigation.navigate('Auth', {
                error: 'Biometric is not enabled. Please enable it to use it.'
            });
        }
    }

    const handleStateChange = nextAppState => {
        console.log('appState: ', appState.current);
        console.log('nextAppState: ', nextAppState);
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            console.log("App has come to the foreground123!");
            console.log(props.shouldUpdate);
            /* if (props.shouldUpdate) {
                autoLogin(false);
            } */
            dispatch(getNotifications());

        }else {
            console.log(props.navigation.state.routeName);
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    }

    const autoLogin = useCallback(async (biometricRequired) => {
        console.log('Should it update: ',props.shouldUpdate);
        const data = await AsyncStorage.getItem('userData');
        if (data) {
            const transformedData = JSON.parse(data);
            //console.log('Transformed Data', transformedData);
            refreshToken = transformedData.refreshToken;
            if (transformedData.expiresIn && new Date() < new Date(transformedData.expiresIn)) {
                //Token didn't expire
                if (biometricRequired) {
                    await biometricHandler();
                } else {
                    console.log('Redirecting to Homepage');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: 'Launch',
                            params: {
                                comingFromBackground: true
                            }
                        })],
                    });
                    props.navigation.dispatch(resetAction);
                    //props.navigation.navigate('Admin');
                }
            } else {
                if (refreshToken) {
                    console.log('Refreshing token!')
                    try {
                        await dispatch(refreshAuthentication(refreshToken));
                        await biometricHandler();
                        props.navigation.navigate('Admin');
                    } catch (err) {
                        //console.log('Error occured: ', err);
                        props.navigation.navigate('Auth', {
                            error: err.message
                        });
                    }
                } else {
                    console.log('Could not find refresh token');
                    AsyncStorage.removeItem('userData');
                    props.navigation.navigate('Auth');
                }
            }
        } else {
            AsyncStorage.removeItem('userData');
            props.navigation.navigate('Auth');
        }
    });

    useEffect(() => {
        AppState.addEventListener('change', handleStateChange);
        autoLogin(true);
    }, []);

    return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});


const mapPropsToState = state => {
    return {
        shouldUpdate: state.auth.shouldUpdate
    }
}

export default connect(mapPropsToState)(StartupScreen);