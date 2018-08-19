import React, {Component} from 'react'
import {StyleSheet, View,Text,Picker, TouchableOpacity, StatusBar} from 'react-native'
import {FormInput, Button,SearchBar,Card, Icon} from 'react-native-elements'
import { createStackNavigator } from 'react-navigation'
import GridView from 'react-native-super-grid'
import ElementRender from './formRender/elementRender'
import axios from 'axios'
import MapView from 'react-native-maps'
import { Marker } from 'react-native-maps'

import config from '../config'

class FirstStep extends Component {
    constructor(props) {
        super(props)
        let {service} = this.props.screenProps
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
                formData : formData
            }
        }

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
            icon={<Icon name='code' color='#ffffff' />}
            backgroundColor='#03A9F4'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='ادامه'
            onPress={() => this.props.navigation.navigate('DynaStep', {
                FieldIndex : 0,
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
        let {service} = this.props.screenProps
        let {FieldIndex, fieldCount, data} = this.getNavigationParams()
        let field = service.DynamicFields[FieldIndex]
        this.state = {
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
            <Card
            title={this.state.field.label}
            >
            <ElementRender field={this.state.field} onChange={(model)=>this.onChange(model)}/>
            {
            (this.state.FieldIndex===this.state.fieldCount) ? (
                <Button
                title='ادامه'
                disabled={!(this.state.data.formData[this.state.FieldIndex].value.length>0)}
                onPress={() => this.props.navigation.navigate('DateStep', {
                    data : this.state.data
                })}
                />
            ):(
            <Button
                icon={<Icon name='code' color='#ffffff' />}              
                title='ادامه'
                buttonStyle={styles.button}
                disabledStyle={styles.disabledButton}
                disabled={!(this.state.data.formData[this.state.FieldIndex].value.length>0)}
                onPress={() => this.props.navigation.push('DynaStep', {
                    FieldIndex : this.state.FieldIndex+1,
                    fieldCount : this.state.fieldCount,
                    data : this.state.data
                })}                
                />
            )
            }
            </Card>            
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
                address : res.data.results[0].formatted_address
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
                    title='ادامه'
                    onPress={() => this.props.navigation.navigate('FinalStep', {
                        data : {
                            ...this.state.data,
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
            data : data
        }
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    render() {
        return (
            <View>
                <Text>{JSON.stringify(this.state.data,null,2)}</Text>
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
    }
   
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
        backgroundColor : 'rgba(92, 99,216, 1)',
    },
    disabledButton : {
        backgroundColor : 'rgba(92, 99,216, 0.1)'
    },
    map : {
        flex : 0.99,
        top : 8,
        bottom : 0
    }
  });

export default Wizard