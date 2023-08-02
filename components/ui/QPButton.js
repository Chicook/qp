import React from 'react'
import { Button, Pressable, Text } from 'react-native'
import { StyleSheet, Vibration } from 'react-native';
import { theme } from './Theme';

const GENTLE_VIBRATION_PATTERN = [0, 50];

export default function QPButton(props) {

    const handlePress = () => {
        Vibration.vibrate(GENTLE_VIBRATION_PATTERN);
        props.onPress && props.onPress();
    };

    // Get the disabled prop from the props object, could be undefined
    const { danger, disabled } = props;


    return (
        <Pressable onPress={handlePress} style={[disabled ? styles.disabledStyle : styles.buttonStyle, { backgroundColor: danger ? theme.darkColors.danger : theme.darkColors.primary }]}>
            <Text style={styles.titleStyle}>{props.title}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        color: 'white',
        borderRadius: 10,
        marginVertical: 10,
        paddingVertical: 10,
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 20,
        color: 'white',
        fontFamily: 'Rubik-SemiBold'
    },
    disabledStyle: {
        opacity: 0.5,
        backgroundColor: theme.darkColors.primary,
    },
})