import React, { useReducer, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Input from '../components/Input';
import Colors from '../constants/Colors';
import { login } from '../store/actions/auth';

const REDUCER_INPUT_UPDATE = 'REDUCER_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === REDUCER_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let formIsValid = true;
        for (let key in updatedValidities) {
            if (!updatedValidities[key]) {
                formIsValid = false;
            }
        }
        return {
            ...state,
            inputValues: updatedValues,
            inputValidities: updatedValidities,
            formIsValid: formIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const dispatch = useDispatch();
    const [reload, setReload] = useState(false);
    const [error, setError] = useState();
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: REDUCER_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    const loginHandler = async () => {
        setError();
        setReload(true);
        try {
            await dispatch(login(formState.inputValues.email, formState.inputValues.password));
            props.navigation.navigate('Admin');
        } catch (err) {
            setError(err);
        }
        setReload(false);
    }

    return (
        <View style={styles.screen}>
            {props.navigation.getParam('error')? 
            <View style={styles.errorContainer}>
                <Text style={styles.error}>{props.navigation.getParam('error') }</Text>
            </View>: null}
            <View style={styles.authCard}>
                <Input
                    id='email'
                    label='E-Mail'
                    errorMessage='Please enter a valid email address!'
                    keyboardType='email-address'
                    autoCapitalize='none'
                    autoCorrect autoFocus
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    initialValue={''}
                    initiallyValid={false}
                    required
                    email />
                <Input id='password' label='Password' keyboardType='default' secureTextEntry required minLength={5}
                    errorMessage='Please enter a valid password' onInputChange={inputChangeHandler} initialValue='' initiallyValid={false} />
                <View style={styles.buttonContainer}>
                    {reload ? <ActivityIndicator size="small" color={Colors.primary} /> :
                        <Button title="Login" onPress={loginHandler} color={Colors.primary} />}
                    <Text style={styles.error}>{error ? error.message : null}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authCard: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: 'hidden',
        width: 350,
        height: 300,
        padding: 20
    },
    buttonContainer: {
        marginVertical: 20,
        width: '80%',
    },
    errorContainer: {
        padding: 20,
        margin: 20
    },
    error: {
        fontFamily: 'open-sans-bold',
        color: Colors.primary,
        fontSize: 18
    }
})

export default AuthScreen;