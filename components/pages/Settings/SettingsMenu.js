import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, Text, View, Pressable, Image, Alert, ScrollView, Linking } from 'react-native';

import QPButton from '../../ui/QPButton';
import { AppContext } from '../../../AppContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ProfilePictureSection from '../../ui/ProfilePictureSection';

// Onsegnal for notifications
import OneSignal from 'react-native-onesignal';

// Get device info to determine the app version
import DeviceInfo from 'react-native-device-info';

export default function SettingsMenu({ navigation }) {

    const { me } = useContext(AppContext);
    const {
        uuid = "",
        email = "",
        profile_photo_url = 'https://qvapay.com/android-chrome-192x192.png',
        name = "",
        lastname = "",
        username = "",
        kyc = 0,
        phone = "",
        golden_check = 0,
        average_rating = "0.0",
    } = me;

    // Footer variables get the from app/build.gradle
    const version = DeviceInfo.getVersion();
    const buildNumber = DeviceInfo.getBuildNumber();

    // useState for the notification switch
    const [isSubscribed, setIsSubscribed] = useState(false);

    // useEffect for the notifications switch
    useEffect(() => {
        const getNotificationsState = async () => {
            try {
                // Obtén el estado del dispositivo desde OneSignal
                const deviceState = await OneSignal.getDeviceState();

                // hasNotificationPermission & isSubscribed son los valores que necesitamos
                const { hasNotificationPermission, isSubscribed } = deviceState;

                // Si el usuario no ha dado permiso para recibir notificaciones, no hagas nada
                // ...

                // launch trigger for permission
                // OneSignal.addTrigger("showPushPermission", 'true');

                // Set external userID to Onesignal
                OneSignal.setExternalUserId(uuid);
                OneSignal.setEmail(email);
                // OneSignal.setSMSNumber(phone);
                // OneSignal.sendTag("key", "value");
    
            } catch (error) {
                // Si algo sale mal, registra el error en la consola
                console.error("Error al obtener el estado de las notificaciones:", error);
            }
        }
        getNotificationsState();
    }, []);

    // Logout and Navigate to AuthStack
    const logout = () => {
        // Show a confirm dialog and then logout
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Sí',
                    onPress: () => {
                        // Logout and navigate to AuthStack
                        EncryptedStorage.removeItem("accessToken");
                        navigation.replace('AuthStack');
                    },
                },
            ],
            { cancelable: false }
        );
    }

    // Settings Items as an object of multiple dimensions:
    const settings = {
        general: {
            title: 'GENERAL',
            options: [
                {
                    title: 'Tema',
                    screen: 'ThemeScreen',
                    enabled: true,
                },
            ],
        },
        account: {
            title: 'CUENTA',
            options: [
                {
                    title: 'Datos personales',
                    screen: 'UserdataScreen',
                    enabled: true,
                },
                {
                    title: 'Idioma',
                    screen: 'Language',
                    enabled: true,
                },
            ],
        },
        security: {
            title: 'SEGURIDAD',
            options: [
                {
                    title: 'Cambiar contraseña',
                    screen: 'PasswordScreen',
                    enabled: true,
                },
                {
                    title: 'Autenticación de dos factores',
                    screen: 'TwoFactorAuthentication',
                    enabled: true,
                },
            ],
        },
        notifications: {
            title: 'NOTIFICACIONES',
            options: [
                {
                    title: 'Configuración de notificaciones',
                    screen: 'NotificationSettings',
                    enabled: true,
                },
            ],
        },
        payment_methods: {
            title: 'AJUSTES DE PAGO',
            options: [
                {
                    title: 'Métodos de pago',
                    screen: 'CreditCards',
                    enabled: false,
                },
                {
                    title: 'Contactos favoritos',
                    screen: 'FavoriteContacts',
                    enabled: false,
                },
                {
                    title: 'Límites',
                    screen: 'LimitsSettings',
                    enabled: false,
                },
            ],
        }
    }

    const SettingsItemSection = ({ section }) => {
        return (
            <View style={styles.box}>
                <Text style={{ fontFamily: 'Rubik-Bold', color: '#fff', fontSize: 16 }}>{section.title}</Text>
                {section.options.map((option, index) => (
                    <SettingsItemSectionItem
                        key={index}
                        // if the option is enabled, navigate to the screen else do nothing
                        title={option.title}
                        onPress={option.enabled ? () => navigation.navigate(option.screen) : () => {
                            console.log(option)
                        }}
                    />
                ))}
            </View>
        );
    };

    const SettingsItemSectionItem = ({ title, onPress }) => {
        return (
            <Pressable onPress={onPress} style={styles.item}>
                <Text style={{ fontFamily: 'Rubik-Regular', color: '#fff' }}>{title}</Text>
                <FontAwesome5 name="angle-right" size={16} style={{ color: '#fff' }} />
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center' }} >

            <View style={styles.box}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <FontAwesome5 name="qrcode" size={14} style={{ color: '#fff' }} onPress={() => navigation.navigate('ScanScreen')} />
                    <FontAwesome5 name="share-square" size={14} style={{ color: '#fff' }} onPress={() => navigation.navigate('ReceiveScreen')} />
                </View>
                <View>
                    <ProfilePictureSection user={me} />
                </View>
                <View>
                    <QPButton
                        title="Editar Perfil"
                        buttonStyle={{ marginBottom: 0 }}
                        onPress={() => navigation.navigate('UserdataScreen')}
                    />
                </View>
            </View>

            {/* GoldenCheck Card */}
            <Pressable
                style={[styles.box, { flexDirection: 'row', alignContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('GoldCheck')}
            >
                <View style={{ marginRight: 20 }}>
                    <Image
                        source={require('../../../assets/images/gold-badge.png')}
                        style={{ width: 28, height: 28 }}
                    />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Rubik-Bold', color: '#fff', fontSize: 16 }}>GOLD CHECK</Text>
                    {
                        golden_check == 1
                            ? <Text style={{ fontFamily: 'Rubik-Regular', color: '#fff', fontSize: 14 }}>Ver mi suscripción</Text>
                            : <Text style={{ fontFamily: 'Rubik-Regular', color: '#fff', fontSize: 14 }}>Comprar GOLD Check</Text>
                    }
                </View>
            </Pressable>

            {/* Referal invitation Card */}
            <Pressable
                style={[styles.box, { flexDirection: 'row', alignContent: 'center', alignItems: 'center' }]}
                onPress={() => navigation.navigate('ReferalInvitation')}
            >
                <View style={{ marginRight: 20 }}>
                    <FontAwesome5 name="gift" size={24} style={{ color: '#fff' }} />
                </View>
                <View>
                    <Text style={{ fontFamily: 'Rubik-Bold', color: '#fff', fontSize: 16 }}>INVITAR AMIGOS</Text>
                    <Text style={{ fontFamily: 'Rubik-Regular', color: '#fff', fontSize: 14 }}>Invita a tus amigos y gana dinero</Text>
                </View>
            </Pressable>

            {Object.values(settings).map((section, index) => (
                <SettingsItemSection key={index} section={section} />
            ))}

            <QPButton buttonStyle={{ backgroundColor: '#ea5455' }} onPress={logout} >
                <Text style={{ fontFamily: 'Rubik-Bold', fontSize: 16 }}>Cerrar Sesión</Text>
            </QPButton>

            {/* Github, Twitter and Instagram accounts */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginVertical: 20 }}>
                <Pressable onPress={() => Linking.openURL('https://github.com/qvapay/qp')}>
                    <FontAwesome5 name="github" size={24} style={{ color: '#fff' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://twitter.com/qvapay')}>
                    <FontAwesome5 name="twitter" size={24} style={{ color: '#fff' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://instagram.com/qvapay')}>
                    <FontAwesome5 name="instagram" size={24} style={{ color: '#fff' }} />
                </Pressable>

                <Pressable onPress={() => Linking.openURL('https://qvapay.raiseaticket.com')}>
                    <FontAwesome5 name="headset" size={24} style={{ color: '#fff' }} />
                </Pressable>
            </View>

            <Text style={styles.copyBottom}>
                {`QvaPay © 2023 \n`}
                {`v ${version} b (${buildNumber})\n`}
                {`Todos los derechos reservados \n`}
            </Text>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#161d31',
    },
    box: {
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        backgroundColor: '#283046',
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    copyBottom: {
        marginTop: 10,
        color: 'white',
        marginBottom: 20,
        textAlign: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        fontFamily: 'Rubik-Regular',
    }
})