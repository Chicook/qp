import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../../ui/Theme';

import KYCAsistantScreen from './KYCAsistantScreen';
import DocumentSubmit from './DocumentSubmit';
import SelfieSubmit from './SelfieSubmit';
import OwnerSubmit from './OwnerSubmit';

import { HeaderBackButton } from '@react-navigation/elements';
const Stack = createNativeStackNavigator();

export default function KYCStack() {

    const navigation = useNavigation();

    return (
        <Stack.Navigator
            name="KYCStack"
            initialRouteName="KYCAsistantScreen"
            screenOptions={{
                title: '',
                headerTintColor: 'white',
                headerShadowVisible: false,
                animation: 'slide_from_right',
                headerStyle: {
                    backgroundColor: theme.darkColors.background,
                },
                headerLeft: (props) => (
                    <HeaderBackButton
                        {...props}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                ),
            }}
        >

            <Stack.Screen
                name="KYCAsistantScreen"
                component={KYCAsistantScreen}
            />

            <Stack.Screen
                name="DocumentSubmit"
                component={DocumentSubmit}
                options={{
                    headerLeft: null,
                }}
            />

            <Stack.Screen
                name="SelfieSubmit"
                component={SelfieSubmit}
                options={{
                    headerLeft: null,
                }}
            />

            <Stack.Screen
                name="OwnerSubmit"
                component={OwnerSubmit}
                options={{
                    headerLeft: null,
                }}
            />

        </Stack.Navigator>
    )
}