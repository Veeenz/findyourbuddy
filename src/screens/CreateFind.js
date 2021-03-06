import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker'
import {Button, Input,Container, Content,Label,Item, Card, CardItem, List, ListItem, Header, Icon, Left, Right, Body,Title} from 'native-base'
import { View, Image, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { findCreate } from '../actions/actions';
import { ImagePicker, Location, MapView, Permissions } from 'expo';

class CreateFind extends Component {
    static navigationOptions = {
        title: 'Segnala'
    }
    state = {
        title: '',
        location: '',
        duedate: new Date().toISOString(),
        images: ['https://thumb.ibb.co/ewYkik/download.png'],
        descr: '',
        latitudeMarker: 0.0,
        longitudeMarker: 0.0,
        latitude: 37.525729,
        longitude: 15.072030,

        error_input_titolo: false,
        error_input_descr: false,
        error_input_posit: false
    }

    componentWillMount(){
        this.retrieveUserLocation()


    }


    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false
        });
        if (!result.cancelled) {
            this.setState({ images: this.state.images.concat(result.uri)});
        }
    };


    retrieveUserLocation = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({ errorMessage: 'Permesso negato'});
        }

        let location = await Location.getCurrentPositionAsync({});

        this.setState({latitude: location.coords.latitude, longitude: location.coords.longitude})
        this.setState({latitudeMarker: location.coords.latitude, longitudeMarker: location.coords.longitude})
        fetch('http://maps.googleapis.com/maps/api/geocode/json?latlng='+location.coords.latitude+','+location.coords.longitude+'&sensor=true')
            .then((response) => response.json())
            .then((data) => {
                if(data.results[1])
                    console.log(data.results[1].formatted_address)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <Container>
                <Content>
                    <Card>
                        <CardItem cardBody>
                            <Item stackedLabel  error={this.state.error_input_titolo} style={{ flex:1 }}>
                                <Label> Titolo </Label>
                                <Input
                                    label="Titolo Ricerca"
                                    placeholder="Titolo della ricerca"
                                    onChangeText={title =>{
                                        if( title === '')
                                            this.setState({error_input_titolo:true})
                                        else
                                            this.setState({
                                                title,
                                                error_input_titolo:false
                                            })
                                    }}
                                />
                            </Item>
                        </CardItem>
                        <CardItem cardBody>
                            <MapView
                                style={{ width, height: height-400 }}
                                rotateEnabled={false}
                                showsUserLocation={true}
                                loadingEnabled={true}
                                initialRegion={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude,
                                    latitudeDelta: 4.0,
                                    longitudeDelta: 4.0,
                                }}
                                //onRegionChangeComplete={(region) => this.setState({latitudeDelta: region.latitudeDelta, longitudeDelta: region.longitudeDelta})}
                                >
                                    <MapView.Marker draggable
                                        coordinate={{
                                            latitude: this.state.latitudeMarker,
                                            longitude: this.state.longitudeMarker,
                                        }}
                                        onDragEnd={(e) => { this.setState({ latitudeMarker: e.nativeEvent.coordinate.latitude, longitudeMarker: e.nativeEvent.coordinate.longitude }, () =>
                                        fetch('http://maps.googleapis.com/maps/api/geocode/json?latlng='+this.state.latitudeMarker+','+this.state.longitudeMarker+'&sensor=true')
                                        .then((response) => response.json())
                                        .then((data) => {
                                            if(data.results[0])
                                                this.setState({location: data.results[0].formatted_address})
                                        })
                                        .catch((error) => {
                                            console.log("ERROR: " + error);
                                        })
                                    )}
                                }

                            />
                        </MapView>
                    </CardItem>

                    <CardItem>
                        <Item stackedLabel  error={this.state.error_input_posit} style={{ flex:1 }}>
                            <Label> Dove hai perso il tuo animale? </Label>
                            <Input
                              style={{ flex: 1, height:80 }}
                                label="Location"
                                placeholder='Sposta il cursore presente sulla mappa sul luogo dove hai perso il tuo animale'
                                multiline={true}
                                value={this.state.location}
                                editable= {false}
                                onChangeText={text => this.setState({ location: text,error_input_posit: false })}
                            />
                        </Item>
                    </CardItem>
                    <CardItem>
                        <Item stackedLabel>
                            <Label>
                                Inserisci le foto del tuo animali,fino a 5
                            </Label>

                            <List
                                horizontal={true}
                                dataArray={this.state.images}
                                renderRow={(image, i) =>{
                                    return (<ListItem button onPress = {() => this._pickImage()}>
                                        <Image
                                            source={{ uri: image }}
                                            resizeMode="cover"
                                            style={{ height :100, width: 200}}
                                            >
                                            </Image>
                                        </ListItem>
                                    )}}>
                                </List>
                            </Item>
                        </CardItem>
                        <CardItem>
                            <Item stackedLabel  style={{ flex:1 }}>
                                <Label>
                                    Quando hai perso il tuo animale?
                                </Label>
                                <DatePicker
                                    style={{ flex: 1, width:'100%' }}
                                    date={this.state.duedate}
                                    mode="date"
                                    value= {this.state.descr}
                                    placeholder="Dove hai perso il tuo animale?"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => {
                                        this.setState({duedate: date})
                                    }}
                                />
                            </Item>
                        </CardItem>
                        <CardItem >
                            <Item stackedLabel error={this.state.error_input_descr} style={{flex: 1, flexDirection:'column'}}>
                                <Label>
                                    Descrizione
                                </Label>
                                <Input
                                    style={{ flex: 1, height:200 }}
                                    placeholder='Inserisci più dettagli'
                                    multiline={true}
                                    onChangeText={text => text === '' ? this.setState({error_input_descr: true}) : this.setState({ descr: text, error_input_descr: false })}
                                />
                            </Item>
                        </CardItem>
                        <CardItem>
                            <Item style={{flex:1}}>
                                <Button onPress={() => {
                                    if (this.state.location === '')
                                        this.setState({error_input_posit: true})
                                    if (this.state.title === '')
                                        this.setState({error_input_titolo: true})
                                    if (this.state.descr === '')
                                        this.setState({error_input_descr: true})
                                    if (this.state.images.length === 1)
                                        alert("Inserisci almeno 1 foto")

                                    if (this.state.location !== '' && this.state.title !== '' && this.state.descr !== '' && this.state.images.length >= 2){
                                        if (this.state.images.indexOf('https://thumb.ibb.co/ewYkik/download.png') >= 0){
                                          imagesCopy= this.state.images
                                          imagesCopy.splice(imagesCopy.indexOf('https://thumb.ibb.co/ewYkik/download.png'),1)
                                          this.setState({images:imagesCopy})
                                        }
                                        this.props.findCreate({
                                            title: this.state.title,
                                            location: this.state.location,
                                            duedate: this.state.duedate,
                                            descr: this.state.descr,
                                            images: this.state.images,
                                            latitudeMarker: this.state.latitudeMarker,
                                            longitudeMarker: this.state.longitudeMarker,
                                            navigateBack: () => this.props.navigation.goBack()
                                        })
                                      }
                                }}
                                style={{flex:1,justifyContent: 'center'}}
                                >
                                    <Text style={{color:'rgb(255,255,255)'}}>
                                       Aggiungi
                                    </Text>
                                </Button>
                            </Item>
                        </CardItem>
                    </Card>

                </Content>
            </Container>
        )
    }
}

export default connect(null, { findCreate }) (CreateFind);
