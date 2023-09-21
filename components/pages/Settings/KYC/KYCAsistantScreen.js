import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { globalStyles, textStyles } from '../../../ui/Theme'
import QPButton from '../../../ui/QPButton';
import QPTabButton from '../../../ui/QPTabButton';
import { useNavigation } from '@react-navigation/native';
import LottieView from "lottie-react-native";
import { AppContext } from '../../../../AppContext';
import { apiRequest } from '../../../../utils/QvaPayClient';

export default function KYCAsistantScreen() {

    const navigation = useNavigation();

    // import AppContext
    const { me } = useContext(AppContext);
    const [verified, setVerified] = useState(me.kyc);

    const [selfieImage, setSelfieImage] = useState(null);
    const [documentImage, setDocumentImage] = useState(null);
    const [documentOwner, setDocumentOwner] = useState(null);

    const [selfieImageStatus, setSelfieImageStatus] = useState(false);
    const [documentImageStatus, setDocumentImageStatus] = useState(false);
    const [documentOwnerStatus, setDocumentOwnerStatus] = useState(false);

    // useEffct for check the verification Status
    useEffect(() => {
        get_kyc_status();
    }, []);

    const get_kyc_status = async () => {
        try {
            const url = `/user/kyc`
            const response = await apiRequest(url, { method: 'GET' }, navigation);

            // Check if isset "document" property and is not ""
            if (response.document_url && response.document_url !== "") {
                setDocumentImageStatus(true);
            }

            // Check if isset "selfie" property and is not ""
            if (response.selfie_url && response.selfie_url !== "") {
                setSelfieImageStatus(true);
            }

            // Check if isset "check" property and is not ""
            if (response.check_url && response.check_url !== "") {
                setDocumentOwnerStatus(true);
            }

            // Check if isset "result" property and is not ""
            if (response.result && response.result !== "") {
                if (response.result === "passed") {
                    setVerified(true);
                } else {
                    setVerified(false);
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            console.log('Finally');
        }
    }

    // Check if this is already verified and if not, navigate to the verification screen
    const handleDocumentImagePress = () => {
        //if (!documentImageStatus) {
            navigation.navigate('DocumentSubmit');
        //}
    }

    // Check if this is already verified and if not, navigate to the verification screen
    const handleSelfieImagePress = () => {
        if (!selfieImageStatus) {
            navigation.navigate('SelfieSubmit');
        }
    }

    // Check if this is already verified and if not, navigate to the verification screen
    const handleDocumentOwnerPress = () => {
        if (!documentOwnerStatus) {
            navigation.navigate('OwnerSubmit');
        }
    }

    return (
        <View style={globalStyles.container}>
            {
                verified ? (
                    <>
                        <LottieView source={require('../../../../assets/lotties/verified.json')} autoPlay style={styles.verifiedLottie} />
                        <Text style={[textStyles.h1, { textAlign: 'center' }]}>¡Tu cuenta está verificada!</Text>
                    </>
                ) : (
                    <>
                        <Text style={textStyles.h1}>Verificar cuenta:</Text>
                        <Text style={textStyles.h6}>Con tu cuenta de QvaPay verificada, podrás acceder a mejoras y nuevas funcionalidades para crecer las posibilidades de tus finanzas.</Text>

                        <View style={styles.stepsContainer}>

                            <QPTabButton title="Documento ID" subtitle="Paso 1" active={documentImageStatus} logo={"id"} onPress={handleDocumentImagePress} />
                            <QPTabButton title="Foto & Video" subtitle="Paso 2" active={selfieImageStatus} logo={"faceid"} onPress={handleSelfieImagePress} />
                            <QPTabButton title="Confirmación" subtitle="Paso 3" active={documentOwnerStatus} logo={"security"} onPress={handleDocumentOwnerPress} />

                        </View>

                        <QPButton title="Siguiente" onPress={() => { }} disabled={true} />

                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={styles.whyTextStyle} onPress={() => { }}>¿Por qué esto es necesario?</Text>
                        </View>
                    </>
                )
            }
        </View >
    )
}

const styles = StyleSheet.create({
    stepsContainer: {
        flex: 1,
        paddingVertical: 10,
    },
    whyTextStyle: {
        fontSize: 14,
        color: 'white',
        paddingVertical: 10,
        alignSelf: 'center',
        textAlign: 'center',
        fontFamily: "Rubik-Regular",
    },
    verifiedLottie: {
        width: 200,
        height: 200,
        alignSelf: 'center',
    },
})