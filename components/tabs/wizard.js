import React, {Component} from 'react'
import {StyleSheet, View,Text,TextInput,TouchableOpacity, ScrollView, AsyncStorage} from 'react-native'
import { FormInput, Button,SearchBar,Card} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import { createStackNavigator } from 'react-navigation'
import GridView from 'react-native-super-grid'
import ElementRender from './formRender/elementRender'
import axios from 'axios'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'

import config from '../../config'


class FirstStep extends Component {
    constructor(props) {
        super(props)
        let {service} = this.props.service || this.props.navigation.state.params || this.props.screenProps || []
        console.log(service)
        
        let formData = service.DynamicFields.map((field)=>{
            return {
                label : field.label,
                value : ''
            }
        })
        let fieldCount = service.DynamicFields.length-1

        this.state={
            service : service,
            fieldCount : fieldCount,
            data : {
                location : '',
                date : '',
                moment : '',
                excerpt : '',
                estimatedCost : '',
                address : '',
                additionalPhone : '',
                formData : formData,
                ServiceId : service.id
            }
        }

    }
    componentDidMount() {
        const {goBack} = this.props.screenProps
        this.props.navigation.setParams({
            goBack
        })
    }
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state
        // let headerTitle=
        let headerLeft = <TouchableOpacity style={{paddingLeft:10}} onPress={() => params.goBack()}>
                            <Icon name="ios-redo-outline" style={{paddingLeft:10}} size={35}/>
                         </TouchableOpacity>
        
        return {headerLeft}
    }
    render() {
        return (
        <Card
        title='توضیحات خود را در مورد این سرویس بنویسید'
        >
        {/* <Text style={{marginBottom: 10}}>
            {JSON.stringify(this.state.service)}
        </Text> */}
        <FormInput multiline onChangeText={(excerpt) => this.setState({data : {...this.state.data, excerpt : excerpt}})} value={this.state.data.excerpt}/>
        <Button
            buttonStyle={styles.button}
            title='ادامه'
            onPress={() => this.props.navigation.navigate('DynaStep', {
                FieldIndex : 0,
                service : this.state.service,
                fieldCount : this.state.fieldCount,
                data : this.state.data
            })}
            />
        </Card>
        )
    }
}

class DynaStep extends Component {
    constructor(props) {
        super(props)
        let {service} = this.props.navigation.state.params || this.props.screenProps || []
        let {FieldIndex, fieldCount, data} = this.getNavigationParams()
        let field = service.DynamicFields[FieldIndex]
        this.state = {
            service : service,
            fieldCount : fieldCount,
            FieldIndex : FieldIndex,
            field : field,
            data : data
        }
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    onChange=(model) => {
        let formData = this.state.data.formData
        formData[this.state.FieldIndex].value = model.map(i=>i.value)
        
        this.setState({
            data : {
                ...this.state.data,
                formData : formData
            }
        })
    }

    render() {
        return(
            <ScrollView>
                <Card
                title={this.state.field.label}
                >
                <ElementRender field={this.state.field} onChange={(model)=>this.onChange(model)}/>
                {
                (this.state.FieldIndex===this.state.fieldCount) ? (
                    <Button
                    title='ادامه'
                    buttonStyle={styles.button}
                    disabled={!(this.state.data.formData[this.state.FieldIndex].value.length>0)}
                    onPress={() => this.props.navigation.navigate('DateStep', {
                        data : this.state.data
                    })}
                    />
                ):(
                <Button
                    title='ادامه'
                    buttonStyle={styles.button}
                    disabledStyle={styles.disabledButton}
                    disabled={!(this.state.data.formData[this.state.FieldIndex].value.length>0)}
                    onPress={() => this.props.navigation.push('DynaStep', {
                        service : this.state.service,
                        FieldIndex : this.state.FieldIndex+1,
                        fieldCount : this.state.fieldCount,
                        data : this.state.data
                    })}                
                    />
                )
                }
                </Card>
            </ScrollView>
        )
    }
}

class DateStep extends Component {
    constructor(props) {
        super(props)
        let {data} = this.getNavigationParams()
        this.state = {
            loading : true,
            dateTimes : [{times:[]}],
            dateTimeIndex : 0,
            data : data
        }
        this.getDateTimes()
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    getDateTimes() {
        axios.get(`${config.ServerURI}/api/service/datetimerange`)
        .then(res=>{
            this.setState({
                dateTimes:res.data,
                loading : false
            })
        })

    }

    onDatePress(date,index) {
        this.setState({
            ...this.state,
            dateTimeIndex : index,
            data : {
                ...this.state.data,
                date: date
            }
        })
    }

    render() {
        return (
            <Card title="چه زمانی به این سرویس نیاز دارید؟">
                <GridView
                    itemDimension={50}
                    items={this.state.dateTimes}
                    renderItem={(item,index) => (
                        <TouchableOpacity
                            onPress={()=>this.onDatePress(item.value,index)}
                            style={
                                item.value === this.state.data.date ? (
                                    styles.DataItemSelected
                                ) : (
                                    styles.DateItem
                                )
                            }
                        >
                            <Text style={styles.DateItemLabel}>{item.label}</Text>
                            <Text>{item.jalali}</Text>
                        </TouchableOpacity>
                    )}
                />
                <GridView
                    itemDimension={90}
                    items={this.state.dateTimes[this.state.dateTimeIndex].times}
                    renderItem={(item,index) => (
                        <TouchableOpacity
                            onPress={
                                ()=>{
                                    this.setState({
                                        ...this.state,
                                        data : {
                                            ...this.state.data,
                                            moment: item.value
                                        }
                                    })
                                }                                
                            }
                            style={
                                item.value === this.state.data.moment ? (
                                    styles.DataItemSelected
                                ) : (
                                    styles.DateItem
                                )
                            }
                        >
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )}                    
                />

                <Button
                    buttonStyle={styles.button}
                    disabledStyle={styles.disabledButton}
                    title='ادامه'
                    disabled={!(this.state.data.date && this.state.data.moment)}
                    onPress={() => this.props.navigation.navigate('MapStep', {
                        data : this.state.data
                    })}                   
                />
            </Card>
        )
    }
}

class MapStep extends Component {
    constructor(props) {
        super(props)
        let {data} = this.getNavigationParams()
        this.state = {
            location : {
                latitude: 0,
                longitude: 0,
            },
            data : data,
            address : '',
            error: null,
        }        
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    getAddress(lat,lon) {
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&language=fa&key=AIzaSyBhgTUioHVo0QhF5URPVFQVnCze4SYMO7c`)
        .then(res=>{
            this.setState({
                address : res.data.results[0].formatted_address,
            })
        })
    }

    _onAchg() {

    }

    componentDidMount() {

        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.setState({
                location : {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                },
                error: null,
            },()=>{
                this.getAddress(position.coords.latitude,position.coords.longitude)
                
            });
          },
          (error) => this.setState({ error: error.message }),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <SearchBar
                    
                    lightTheme
                    searchIcon={{ size: 24 }}
                    value = {this.state.manualAddress}
                    onChangeText={(t)=>this.setState({manualAddress : t})}
                    onClear={()=>this.setState({manualAddress : ''})}
                    placeholder='نشانی مدنظر شما'
                />
                <Text>{this.state.address}</Text>
                <MapView
                    style={styles.map}
                    region = {{
                        latitude : this.state.location.latitude,
                        longitude : this.state.location.longitude,
                        latitudeDelta : 0.1,
                        longitudeDelta : 0.1
                    }}
                >
                    <Marker draggable
                        coordinate={this.state.location}
                        title="مکان سرویس"
                        description={this.state.address}
                        onDragEnd={(e) =>{
                                this.setState(
                                    { location: e.nativeEvent.coordinate }
                                )
                                this.getAddress(e.nativeEvent.coordinate.latitude,e.nativeEvent.coordinate.longitude)
                            }
                        }
                    />
                </MapView>
                <Button
                    style={styles.button}
                    title='ادامه'
                    onPress={() => this.props.navigation.navigate('FinalStep', {
                        data : {
                            ...this.state.data,
                            location : `${this.state.location.latitude},${this.state.location.longitude}` ,
                            address : `نشانی خودکار:${this.state.address} نشانی دستی:${this.state.manualAddress}`
                        }
                    })}></Button>
            </View>
        )
    }
}

class FinalStep extends Component {
    constructor(props) {
        super(props)

        let {data} = this.getNavigationParams()

        this.state = {
            data : data,
            additionalPhone : '',
            estimatedCost : '',
            sending : false,
            sent : false
        }
    }

    async onSubmit() {
        let userToken = await AsyncStorage.getItem('userToken');
        let {data} = this.state
        data.estimatedCost = this.state.estimatedCost
        data.additionalPhone = this.state.additionalPhone

        this.setState({
            // sending : true
        },()=>{
            axios.post(`${config.ServerURI}/api/job`,data,{
                'headers' : {
                    'x-access-token' : userToken
                }
            })
            .then(res=>{
                this.setState({
                    sending : false,
                    sent : true
                })
                
            })
        })
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    render() {
        if(this.state.sent)
            return(
                <View>
                    <Text style={{color:green}}>
                        درخواست سرویس شما با موفقیت ارسال شد و از بخش درخواست های من قابل پیگیریست.
                    </Text>
                </View>
            )
        return (
            <View style={styles.container}>
                {/* <Text>{JSON.stringify(this.state.data,null,2)}</Text> */}
                <Card title="اطلاعات تکمیلی">
                    <View style={{flexDirection : 'row', marginBottom : 10}}>
                        <Icon
                            style={{flex : 0.1}}
                            name='ios-cash-outline'
                            size={32}
                            color='black'
                        />
                        <Text style={{flex:0.4, padding : 3}}>مبلغ مورد نظر شما</Text>
                        <TextInput value={this.state.estimatedCost} onChangeText={(estimatedCost)=>this.setState({estimatedCost})} keyboardType="numeric" style={{flex : 0.5, padding : 3, backgroundColor : 'rgb(248,248,248)' }}></TextInput>
                    </View>
                    <View style={{flexDirection : 'row', marginBottom : 25}}>
                        <Icon
                            style={{flex : 0.1}}
                            name='ios-call-outline'
                            size={32}
                            color='black'
                        />
                        <Text style={{flex:0.4, padding : 3}}>تلفن ثابت</Text>
                        <TextInput value={this.state.additionalPhone} onChangeText={(additionalPhone)=>this.setState({additionalPhone})} keyboardType="phone-pad" style={{flex : 0.5, padding : 3, backgroundColor : 'rgb(248,248,248)' }}></TextInput>
                    </View>
                    <Button
                        buttonStyle={styles.button}
                        disabledStyle={styles.disabledButton}
                        onPress={()=>this.onSubmit()}
                        title='ارسال درخواست'
                        loading={this.state.sending}
                        disabled = {!(this.state.estimatedCost && this.state.additionalPhone) || this.state.sending}
                    />
                </Card>
                
            </View>
        )
    }
}

const Wizard = createStackNavigator({
  
    FirstStep: {
      screen: FirstStep
    },
    DynaStep : {
        screen : DynaStep
    },
    DateStep : {
        screen : DateStep
    },
    MapStep : {
        screen : MapStep
    },
    FinalStep : {
        screen : FinalStep
    },  
   
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    DateItem : {
        alignItems: 'center',
        justifyContent: 'center',        
        borderWidth : 1,
        borderColor : '#000',
        padding : 5,
        borderRadius : 7,
    },
    DataItemSelected : {
        alignItems: 'center',
        justifyContent: 'center',        
        borderWidth : 2,
        borderColor : '#000',
        padding : 5,
        borderRadius : 7,
    },
    DateItemLabel : {
        color : 'green',
        
    },
    button : {
        backgroundColor : 'rgba(8, 129, 163, 1)',
    },
    disabledButton : {
        backgroundColor : 'rgba(8, 129, 163, 0.1))'
    },
    map : {
        flex : 0.99,
        top : 8,
        bottom : 0
    }
  });

export default Wizard