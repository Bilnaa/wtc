import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getTop10GarageLeastPricy } from '../models/garage_od';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    garages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    garage: {
        padding: 10,
        margin: 10,
        backgroundColor: 'lightgrey',
    },
});


function SettingsScreen() {
    const ville = 'Angers';
    const postalCode = '49100';
    const [garages, setGarages] = React.useState([]);

    React.useEffect(() => {
        getTop10GarageLeastPricy(ville, postalCode).then((data) => {
            setGarages(data);
        });
    }
        , []);



    return (
        <View style={styles.container}>
            <Text> Top 10 des garages les moins cher de votre ville : {ville}</Text>
            <Text>Code postal : {postalCode}</Text>
            <View>
                {garages.map((garage, index) => {
                    return (
                        <View key={index} style={styles.garage}>
                            <Text>{garage.cct_denomination}</Text>
                        </View>
                    )
                })}
            </View>
        </View>
    );
}

export default SettingsScreen;