import * as React from 'react';
// import { Text, View,StyleSheet } from 'react-native';
import HomeScreen from '../screens/home';
import SettingsScreen from '../screens/settings';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


// const styles = StyleSheet.create({
//     tab : {
//         backgroundColor: 'red',
//         color: 'white'
//     }
// })

const Tab = createBottomTabNavigator();

function MyTabs() {


    return (
        <Tab.Navigator screenOptions={
            {
                tabBarActiveTintColor: 'red',
                tabBarInactiveTintColor: 'black',
                tabBarActiveBackgroundColor: 'white',
                tabBarInactiveBackgroundColor: 'white',
                tabBarStyle: {
                    backgroundColor: 'white'
                }
            }

        }>
            <Tab.Screen name="Trouver votre Garage" component={HomeScreen} />
            <Tab.Screen name="Top 10 Garage de votre Région" component={SettingsScreen} />
        </Tab.Navigator>
    );
}
export default MyTabs;