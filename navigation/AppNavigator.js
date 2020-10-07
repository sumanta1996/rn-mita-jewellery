import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AdminConsoleScreen from '../screens/AdminConsoleScreen';
import ManageProductsScreen from '../screens/ManageProductsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import Colors from '../constants/Colors';
import LaunchScreen from '../screens/LaunchScreen';
import AuthScreen from '../screens/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

 const navigationOptions = {
    headerStyle: {
        backgroundColor: Colors.primary
    },
    headerTintColor: 'white',
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
};


const AdminNavigator = createStackNavigator({
    Launch: LaunchScreen,
    Admin: AdminConsoleScreen,
    Products: ManageProductsScreen,
    Orders: OrdersScreen
}, {
    defaultNavigationOptions: navigationOptions
});

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: navigationOptions
});

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Admin: AdminNavigator
});

export default createAppContainer(MainNavigator);