import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, Image, Alert } from 'react-native';
import Colors from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImageSelector = props => {
    const [image, setImage] = useState(props.url? props.url: null);

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert('Insufficient permissions!', 'You need to allow permission to use this app!', [{ text: 'Okay' }]);
            return false;
        }
        return true;
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [9,16],
            quality: 0.5
        });

        console.log(image.uri);
        //console.log(newPath);
        setImage(image.uri);
        props.onImageTaken(image.uri);
    }

    return (
        <View style={styles.imagePicker}>
            {!image ? <Text>Pick an image.</Text> :
            <View style={styles.imagePreview}>
                    <Image style={styles.image} source={{ uri: image }} />
            </View>}
            <Button title="Take Image" color={Colors.primary} onPress={takeImageHandler} />
        </View>
    )
}

const styles = StyleSheet.create({
    imagePicker: {
        alignItems: 'center',
        marginVertical: 15
    },
    imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    image: {
        width: '100%',
        height: '100%'
    }
});

export default ImageSelector;