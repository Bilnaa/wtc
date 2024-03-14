import * as React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Animated,
    Image,
    Button,
    TouchableOpacity,
    Dimensions,
    Platform,
    Alert
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getGarages } from '../models/garage_od';
import GaragePin from '../img/garage-pin.png';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
        // all the screen

    },

    searchBox: {
        position: 'absolute',
        flexDirection: "row",
        backgroundColor: '#fff',
        width: '90%',
        alignSelf: 'center',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 10,
    },
    GooglePlacesAutocomplete: {
        width: '90%',
        position: 'absolute',
        top: 10,
        right: 20,
    },
    trouverGarages: {
        position: 'absolute',
        bottom: 10,
        right: 20
    },
    button_left: {
        display: 'flex',
        // bottom right of the screen
        position: 'absolute',
        bottom: 1,
        left: 3,
        borderColor: 'red',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    },
    button_right: {
        display: 'flex',
        // bottom right of the screen
        position: 'absolute',
        right: 3,
        borderColor: 'red',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 5
    }

});

function HomeScreen() {
    // long lat of france = 46.603354, 1.888334
    const [mapCoords, setMapCoords] = React.useState({});
    const [errorMsg, setErrorMsg] = React.useState(null);
    const [address, setAddress] = React.useState(null);
    const [markers, setMarkers] = React.useState([]);
    const [autoplace, setAutoPlace] = React.useState({
        latitude: 46.603354,
        longitude: 1.888334,
        title: 'France',
        description: 'Centre de la France'
    });

    const userLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            Alert.alert('Erreur', errorMsg);
            return;
        }
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });
        setMapCoords({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        })
        await getReverseGeocodingAsync(location.coords.latitude, location.coords.longitude);

    }

    async function getReverseGeocodingAsync(lat, long) {
        let location = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: long,
        });
        setAddress(location[0]);
    }

    function formatAddress() {
        if (address) {
            return `${address.name} ${address.streetNumber} ${address.street} ${address.postalCode} ${address.city}`;
        }
        return '';
    }

    async function getGaragesMarkers() {
        let pins = [];
        setMarkers([]);
        let results = await getGarages(address.city, address.postalCode);
        for (let result of results) {
            let pin = {
                coordinate: {
                    latitude: result.latitude,
                    longitude: result.longitude
                },
                city: result.cct_ville,
                title: result.cct_denomination,
                description: result.cct_adresse
            }
            pins.push(pin);
        }
        setMarkers(pins);
    }
    handleCenter = async () => {
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });
        await getReverseGeocodingAsync(location.coords.latitude, location.coords.longitude)
        const { latitude, longitude, latitudeDelta, longitudeDelta } = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
        this.map.animateToRegion({
            latitude,
            longitude,
            latitudeDelta,
            longitudeDelta
        })
    }

    React.useEffect(() => {
        const handle = async () => {
            setTimeout(async () => {
                await userLocation().then(
                    () => {
                        console.log('User location : ', mapCoords);
                    }
                );
                await getReverseGeocodingAsync(mapCoords.latitude, mapCoords.longitude);
            }, 1000);
        }
        handle();
    }, []);
    return (
        <View style={styles.container}>
            <MapView ref={map => { this.map = map }} style={styles.map} provider={PROVIDER_GOOGLE} region={mapCoords} showsUserLocation cacheEnabled showsBuildings showsCompass>
                <Marker coordinate={mapCoords} title="Votre position" description={formatAddress()} />
                <Marker coordinate={autoplace} title={autoplace.title} description={autoplace.description} />
                {
                    (markers).map((marker, index) => (
                        <View style={
                            {
                                width: 10,
                                height: 10
                            }
                        } key={index}>
                            <Marker
                                key={index}
                                coordinate={marker.coordinate}
                                title={marker.title}
                                description={marker.description}
                                image={GaragePin}
                            >
                            </Marker>
                        </View>

                    ))
                }
            </MapView>

            <View style={styles.GooglePlacesAutocomplete}>
                <GooglePlacesAutocomplete
                    placeholder="Chercher une adresse"
                    onPress={async (data, details = null) => {
                        setMapCoords({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        });
                        getReverseGeocodingAsync(details.geometry.location.lat, details.geometry.location.lng);
                        setAutoPlace({
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            title: data.structured_formatting.main_text,
                            description: data.structured_formatting.secondary_text
                        });
                    }}
                    query={{ key: 'AIzaSyBsrGZ-WoS0B_ojKA_iLRxhwHZsMWbIlVA', components: 'country:fr' }}
                    fetchDetails
                    onFail={error => setErrorMsg(error)}
                    onNotFound={() => setErrorMsg('No results were found')}
                />
            </View>
            <View style={styles.button_right}>
                <Icon.Button
                    name="crosshairs-gps"
                    backgroundColor="red"
                    onPress={handleCenter}
                    size={30}
                />
            </View>
            <View style={styles.button_left}>
                <Icon.Button
                    name="radar"
                    backgroundColor="red"
                    onPress={async () => await getGaragesMarkers()}
                    size={30}
                />
            </View>
        </View>

    );
}



export default HomeScreen;