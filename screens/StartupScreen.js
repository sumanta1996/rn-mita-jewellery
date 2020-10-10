import React, { useEffect } from 'react';
import Colors from '../constants/Colors';
import { ActivityIndicator, View, StyleSheet, AsyncStorage } from 'react-native';
import { useDispatch } from 'react-redux';
import { refreshAuthentication } from '../store/actions/auth';
import * as LocalAuthentication from 'expo-local-authentication';

const StartupScreen = props => {
    const dispatch = useDispatch();
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

    useEffect(() => {
        const autoLogin = async () => {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const transformedData = JSON.parse(data);
                //console.log('Transformed Data', transformedData);
                refreshToken = transformedData.refreshToken;
                if (transformedData.expiresIn && new Date() < new Date(transformedData.expiresIn)) {
                    //Token didn't expire
                    await biometricHandler();
                } else {
                    if (refreshToken) {
                        //console.log('Refreshing token!')
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
                        //console.log('Could not find refresh token');
                        AsyncStorage.removeItem('userData');
                        props.navigation.navigate('Auth');
                    }
                }
            } else {
                AsyncStorage.removeItem('userData');
                props.navigation.navigate('Auth');
            }
        }
        autoLogin();
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

export default StartupScreen;