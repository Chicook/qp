import AsyncStorage from '@react-native-async-storage/async-storage';

// Calculate time since data
const timeSince = (date) => {

    const now = new Date();
    const secondsPast = (now.getTime() - date.getTime()) / 1000;

    if (secondsPast < 60) {
        const seconds = parseInt(secondsPast);
        return `${seconds} segundo${seconds > 1 ? 's' : ''}`;
    }
    if (secondsPast < 3600) {
        const minutes = parseInt(secondsPast / 60);
        return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
    }
    if (secondsPast <= 86400) {
        const hours = parseInt(secondsPast / 3600);
        return `${hours} hora${hours > 1 ? 's' : ''}`;
    }
    if (secondsPast > 86400) {
        const day = parseInt(secondsPast / 86400);
        return `${day} dia${day > 1 ? 's' : ''}`;
    }
    if (secondsPast > 604800) {
        const week = parseInt(secondsPast / 604800);
        return `${week} semana${week > 1 ? 's' : ''}`;
    }
}

// String reduce function from P2P_796a9e71-3d67-4a42-9dc2-02a5d069fa23 to P2P_796a9e71
const reduceString = (string) => {
    return string.substring(0, 20);
}

// Get a long format date and return a short format date time
const getShortDateTime = (date) => {
    desiredDate = new Date(date);
    return desiredDate.toLocaleString('es-ES', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
}

// get a time ago from a date
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " año" + (Math.floor(interval) > 1 ? "s" : "");
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " mes" + (Math.floor(interval) > 1 ? "es" : "");
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " día" + (Math.floor(interval) > 1 ? "s" : "");
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hora" + (Math.floor(interval) > 1 ? "s" : "");
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minuto" + (Math.floor(interval) > 1 ? "s" : "");
    }
    return Math.floor(seconds) + " segundo" + (Math.floor(seconds) > 1 ? "s" : "");
}

// get a QR data and parse it, get the usernam, amount and transactionUUID
const parseQRData = (data) => {

    // Add a Bitcoin Lighning reader when starting with "lnbc1",
    // a Bitcoin reader when start with bc1, 1, or 3
    // and a QP reader when starts with qp://
    // A common QP qr is qp://u:username:a:amount:t:transactionUUID
    // splitted could be ["u", "username", "a", "amount", "t", "transactionUUID"]

    // In case of a qp:// schema
    if (data.startsWith('qp://')) {
        const params = data.replace('qp://', '').split(':');
        const parsedData = {};
        for (let i = 0; i < params.length; i += 2) {
            const key = params[i];
            const value = params[i + 1];
            switch (key) {
                case 'u':
                    parsedData.username = value;
                    break;
                case 'a':
                    parsedData.amount = value;
                    break;
                case 't':
                    parsedData.transactionUUID = value;
                    break;
                default:
                    break;
            }
        }
        // set qp property to true
        parsedData.qp = true;
        return parsedData;
    }

    // TODO In case of a lnbc1 schema
    // TODO In case of a bc1 schema
};

// Check for a valid QR data
const isValidQRData = (parsedData) => {
    if (parsedData === null) {
        return false;
    }
    if ('transactionUUID' in parsedData) {
        return true;
    }

    // TODO add validations for other schemas

    return 'username' in parsedData && 'amount' in parsedData;
};


// Get a list of coins and filter them by IN/OUT/P2P 
const filterCoins = ({ coins, in_out_p2p = "IN" }) => {

    const filterByInOut = (option) => {
        if (in_out_p2p === 'IN') {
            return option.enabled_in;
        } else if (in_out_p2p === 'OUT') {
            return option.enabled_out;
        } else if (in_out_p2p === 'P2P') {
            return option.enabled_p2p;
        } else {
            return false;
        }
    };

    const filterCategoryCoins = (categoryName) => {
        const category = coins.find((category) => category.name === categoryName);
        if (category) {
            const filteredCoins = category.coins.filter(filterByInOut);
            return filteredCoins;
        }
        return [];
    };

    const filteredBanks = filterCategoryCoins('Bank');
    const filteredCryptoCurrencies = filterCategoryCoins('Criptomonedas');
    const filteredEWallets = filterCategoryCoins('E-Wallet');

    return {
        banks: filteredBanks,
        cryptoCurrencies: filteredCryptoCurrencies,
        eWallets: filteredEWallets,
    };
};

// Show only initial and latest letters from a wallet
const truncateWalletAddress = (address) => {
    if (address.length > 28) {
        return address.substring(0, 10) + '...' + address.substring(address.length - 10);
    }
    return address;
};

const adjustNumber = (value) => {

    const numValue = parseFloat(value);

    // Si no es un número válido, retornar el valor original
    if (isNaN(numValue)) {
        return value.toString();
    }

    // Si el valor es 0, retornar null
    if (numValue === 0) {
        return null;
    }

    // Si el valor es superior a 1, retornar con dos decimales
    if (numValue >= 1) {
        return numValue.toFixed(2);
    }

    // Si el valor está entre 0 y 0.0001, convertir a notación exponencial
    if (numValue > 0 && numValue < 0.0001) {
        let exponentValue = numValue.toExponential();
        let [mantissa, exponent] = exponentValue.split('e');
        mantissa = parseFloat(mantissa).toFixed(1);
        return `${mantissa}e${exponent}`;
    }

    // Si no se cumplen las condiciones anteriores, retornar el valor como está
    return numValue.toFixed(2);
}

// transform "buy" and "sell" text into "Compra" and "Venta"
const transformText = (text) => {
    if (text === "buy") {
        return "Compra";
    }
    if (text === "sell") {
        return "Venta";
    }
    return text;
}

// Save contact function
const saveContact = async (contact) => {
    try {

        const userToSave = {
            uuid: contact.uuid,
            name: contact.name,
            username: contact.username,
            source_uri: contact.profile_photo_url,
        }

        const contacts = await AsyncStorage.getItem('contacts');
        let newContacts = [];
        if (contacts) {
            newContacts = JSON.parse(contacts);
            const contactIndex = newContacts.findIndex((contact) => contact.uuid === userToSave.uuid)
            if (contactIndex === -1) {
                newContacts.push(userToSave)
            } else {
                newContacts[contactIndex] = userToSave
            }
            await AsyncStorage.setItem('contacts', JSON.stringify(newContacts))
        } else {
            await AsyncStorage.setItem('contacts', JSON.stringify([userToSave]))
        }
    } catch (error) {
        console.log(error);
    }
};

// export timeSince function
export {
    timeSince,
    reduceString,
    getShortDateTime,
    parseQRData,
    isValidQRData,
    filterCoins,
    truncateWalletAddress,
    adjustNumber,
    timeAgo,
    transformText,
    saveContact
};