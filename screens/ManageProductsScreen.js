import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, FlatList, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LaunchCard from '../components/LaunchCard';
import { fetchProducts } from '../store/actions/admin';

const ManageProductsScreen = props => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const dispatch = useDispatch();
    const products = useSelector(state => state.admin.products);

    const fetchProductsFrom = useCallback(async () => {
        setIsRefreshing(true);
        await dispatch(fetchProducts());
        setIsRefreshing(false);
    }, [setIsRefreshing]);

    const renderProductHandler = itemData => {
        return <LaunchCard deleteFeature productId={itemData.item.key} label={itemData.item.title} uri={itemData.item.url.url1} onPress={() => {
            props.navigation.navigate('Admin', {
                productId: itemData.item.key
            });
        }} />
    }

    useEffect(() => {
        fetchProductsFrom();
    }, []);

    return <FlatList columnWrapperStyle={styles.screen} numColumns={2} data={products} keyExtractor={(item, index) => item.id}
                renderItem={renderProductHandler} onRefresh={fetchProductsFrom} refreshing={isRefreshing} />
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'space-between',
        marginBottom: 20
    }
});

export default ManageProductsScreen;