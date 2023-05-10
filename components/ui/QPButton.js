import React from 'react'
import { Button } from '@rneui/themed';
import { StyleSheet } from 'react-native';

export default function QPButton(props) {

    return (
        <Button
            {...props}
            titleStyle={[styles.titleStyle, props.titleStyle]}
            buttonStyle={[styles.buttonStyle, props.buttonStyle]}
            disabledStyle={[styles.disabledStyle, props.disabledStyle]}
        />
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        height: 40,
        borderWidth: 0,
        color: '#FFFFFF',
        borderRadius: 10,
        marginVertical: 20,
        alignItems: 'center',
        backgroundColor: '#7367f0',
    },
    disabledStyle: {
        opacity: 0.5,
        backgroundColor: '#7367f0',
    },
})