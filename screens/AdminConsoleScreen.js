import React, { useReducer, useCallback, useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button, Text, Picker, ActivityIndicator } from 'react-native';
import Input from '../components/Input';
import ImagePicker from '../components/ImagePicker';
import firebase from "firebase";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchLatestId, uploadContent, editContent } from '../store/actions/admin';
import Colors from '../constants/Colors';

const REDUCER_INPUT_UPDATE = 'REDUCER_INPUT_UPDATE';
const REDUCER_IMAGE_UPDATE = 'REDUCER_IMAGE_UPDATE';
const RESET_DATA = 'RESET_DATA';

const AdminConsoleScreen = props => {
    const prodId = props.navigation.getParam('productId');
    let editedProduct = useSelector(state => state.admin.products.find(product => product.key === prodId));

    const initialState = {
        inputValues: {
            title: editedProduct ? editedProduct.title : '',
            details: editedProduct ? editedProduct.details : '',
            price: editedProduct ? editedProduct.price : '',
            length: editedProduct ? editedProduct.length : '',
            width: editedProduct ? editedProduct.width : '',
            height: editedProduct ? editedProduct.height : '',
        },
        inputValidities: {
            title: editedProduct ? true : false,
            details: editedProduct ? true : false,
            price: editedProduct ? true : false,
            length: editedProduct ? true : false,
            width: editedProduct ? true : false,
            height: editedProduct ? true : false,
        },
        imageUrls: {
            url1: editedProduct ? editedProduct.url.url1 : '',
            url2: editedProduct ? editedProduct.url.url2 : '',
            url3: editedProduct ? editedProduct.url.url3 : ''
        },
        formIsValid: editedProduct ? true : false,
        fetchId: false
    }

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
        if (action.type === REDUCER_IMAGE_UPDATE) {
            const updatedValues = { ...state.imageUrls };
            updatedValues[action.input] = action.value;
            return {
                ...state,
                imageUrls: updatedValues
            }
        }
        if (action.type === RESET_DATA) {
            const updatedState = { ...initialState };
            return {
                ...updatedState,
                fetchId: !state.fetchId
            }
        }
        return state;
    }

    const [formState, dispatchFormState] = useReducer(formReducer, initialState);
    const [selectedCategory, setSelectedCategory] = useState(editedProduct ? editedProduct.category : null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const fetchId = formState.fetchId;
    const id = editedProduct ? editedProduct.id : useSelector(state => state.admin.latestId);
    const categories = useSelector(state => state.admin.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    useEffect(() => {
        dispatch(fetchLatestId());
    }, [dispatch, fetchId]);

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: REDUCER_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState]);

    const imageSetHandler = async (inputIdentifier, imageUrl) => {
        dispatchFormState({
            type: REDUCER_IMAGE_UPDATE,
            input: inputIdentifier,
            value: imageUrl
        });
    }

    const imageUploadHandler = async () => {
        const uploadedImageUrls = {
            url1: '',
            url2: '',
            url3: ''
        }
        for (let key in formState.imageUrls) {
            if (formState.imageUrls[key] !== '') {
                try {
                    const response = await fetch(formState.imageUrls[key]);
                    const blob = await response.blob();
                    const ref = firebase.storage().ref().child('images/' + formState.imageUrls[key].split('/').pop());
                    await ref.put(blob);
                    const url = await ref.getDownloadURL();
                    uploadedImageUrls[key] = url;
                } catch (err) {
                    console.log(err);
                }
            }
        }
        return uploadedImageUrls;
    }

    const submitHandler = async () => {
        setIsLoading(true);
        const imageUrls = await imageUploadHandler();
        const category = !selectedCategory ? categories[0] : selectedCategory;
        //Perform submit
        if (editedProduct) {
            await dispatch(editContent(prodId, id, formState.inputValues.title, category, formState.inputValues.details,
                formState.inputValues.price, formState.inputValues.length, formState.inputValues.width, formState.inputValues.height, imageUrls));
            props.navigation.goBack();
        } else {
            await dispatch(uploadContent(id, formState.inputValues.title, category, formState.inputValues.details,
                formState.inputValues.price, formState.inputValues.length, formState.inputValues.width, formState.inputValues.height, imageUrls));
            dispatchFormState({ type: RESET_DATA });
            setIsLoading(false);
        }
    }

    if (!(id && categories) || isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <ScrollView>
            <View style={styles.screen}>
                <Text style={styles.text}>Image ID: {id}</Text>
                <Input
                    id='title'
                    label='Title'
                    errorMessage='Please enter a valid Title!'
                    keyboardType='default'
                    autoCorrect autoFocus
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.title : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Input
                    id='details'
                    label='Details'
                    errorMessage='Please enter valid details!'
                    keyboardType='default'
                    autoCorrect autoFocus
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.details : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Input
                    id='price'
                    label='Price'
                    errorMessage='Please enter valid price!'
                    keyboardType='decimal-pad'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.price : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Input
                    id='length'
                    label='Length(in cm)'
                    errorMessage='Please enter valid length!'
                    keyboardType='decimal-pad'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.length : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Input
                    id='width'
                    label='Width'
                    errorMessage='Please enter a valid width!'
                    keyboardType='decimal-pad'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.width : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Input
                    id='height'
                    label='Height'
                    errorMessage='Please enter a valid Height!'
                    keyboardType='decimal-pad'
                    onInputChange={inputChangeHandler}
                    initialValue={editedProduct ? editedProduct.height : ''}
                    initiallyValid={!!editedProduct}
                    required />
                <Picker selectedValue={selectedCategory} onValueChange={(itemValue) => {
                    setSelectedCategory(itemValue);
                }}>
                    {categories.map(category => <Picker.Item key={category} label={category} value={category} />)}
                </Picker>
                <View style={styles.images}>
                    <ImagePicker url={editedProduct ? editedProduct.url.url1 : null} onImageTaken={imageSetHandler.bind(this, 'url1')} />
                    <ImagePicker url={editedProduct && editedProduct.url.url2 !== '' ? editedProduct.url.url2 : null} onImageTaken={imageSetHandler.bind(this, 'url2')} />
                    <ImagePicker url={editedProduct && editedProduct.url.url3 !== '' ? editedProduct.url.url3 : null} onImageTaken={imageSetHandler.bind(this, 'url3')} />
                </View>
                <Button title="Submit" onPress={submitHandler} />
            </View>
        </ScrollView>
    )
}

AdminConsoleScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Content' : 'Upload Content'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin: 20
    },
    images: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'open-sans-bold',
        fontSize: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default AdminConsoleScreen;