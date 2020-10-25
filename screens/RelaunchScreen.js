import React, { useState, useRef, useEffect } from 'react';
import { View, AppState } from 'react-native';

const RelaunchScreen = props => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    //console.log(appStateVisible);

    const handleStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === "active") {
            console.log("App has come to the foreground! I am here");
            props.navigation.navigate('Startup');
        }
        //props.navigation.navigate('Startup');
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    }

    useEffect(() => {
        AppState.addEventListener('change', handleStateChange);

        return () => AppState.removeEventListener('change', handleStateChange);
    }, [appStateVisible]);

    return (
        <View>

        </View>
    )

}

export default RelaunchScreen;