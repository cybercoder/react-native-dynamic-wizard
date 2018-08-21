import React, {Component} from 'react'
import {StyleSheet, View, Text,  TextInput, AsyncStorage, StatusBar, Image, TouchableOpacity, KeyboardAvoidingView,SafeAreaView} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {createStackNavigator} from 'react-navigation'
import { getStatusBarHeight } from 'react-native-status-bar-height'

class SignInorRegister extends Component {
    constructor() {
        super()
        this.state = {
            mobilePhone : '',
            valid : false
        }
    }
    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };
    static navigationOptions = {
        header: ( /* Your custom header */
          <View>
          </View>
        )
    }
    onChange(mobilePhone) {
        const regex= /^[0][9][1-9][0-9]{8,8}$/g
        regex.test(mobilePhone) ?
            this.setState({mobilePhone , valid : true})
        :
            this.setState({mobilePhone, valid : false})
    }

    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style = {styles.container}>
                <StatusBar barStyle="dark-content"></StatusBar>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../images/logo-light.png')}
                    />
                </View>
                <View style={styles.formContainer}>
                    <View style={{flexDirection : 'row', marginBottom : 10}}>
                        {
                            this.state.valid ? (
                                <Icon
                                style={{flex : 0.1}}
                                name="ios-checkmark-circle"
                                size={28}
                                color='green'
                                />
                            ) : (
                                <Icon
                                style={{flex : 0.1}}
                                name="ios-alert"
                                size={28}
                                color='red'
                                />
                            )
                        }
                        <TextInput
                            value = {this.state.mobilePhone}
                            onChangeText={(mobilePhone)=>this.onChange(mobilePhone)}
                            keyboardType="phone-pad"
                            placeholder="09xx xxx xxxx"
                            style={{fontSize : 18, flex : 0.8, padding : 3,  }}
                        />
                        <Icon
                            style={{flex : 0.2}}
                            name='ios-call-outline'
                            size={40}
                            color='black'
                        />
                    </View>
                    
                    <TouchableOpacity  style={styles.buttonContainer} onPress={()=>this.props.navigation.navigate('Verification',{mobilePhone:''})}>
                        <Text style={styles.buttonText}>ادامه</Text>
                    </TouchableOpacity>
                    
                </View>
            </KeyboardAvoidingView>
        )
    }
}

class Verification extends Component {
    constructor() {
        super()
        this.state = {
            counting : true
        }
    }

    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    }

    static navigationOptions = {
        header: ( /* Your custom header */
            <View>
            </View>
        )
    }
    render() {
        return(
            <KeyboardAvoidingView behavior="padding" style = {styles.container}>
                <StatusBar barStyle="dark-content"></StatusBar>
                <View style={styles.activationContainer}>
                    <Text>کدفعالسازی دریافتی از طریق پیامک را وارد نمایید</Text>
                    <View style={{flexDirection : 'row', marginBottom : 10}}>
                        <TextInput
                            keyboardType="numeric"
                            style={{fontSize : 18, flex : 0.8, padding : 3,  }}
                        />
                        <Icon
                            style={{flex : 0.2}}
                            name='ios-key-outline'
                            size={40}
                            color='black'
                        />
                    </View>
                    
                    <TouchableOpacity  style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>ادامه</Text>
                    </TouchableOpacity>
                    {
                        (this.state.counting) ? (
                            <View style={{flexDirection : 'row', marginBottom : 10}} >
                                <Text>فعال شدن مجدد ارسال کد فعالسازی در:</Text>
                                <CountDownTimer start="3" interval="1" onFinish={()=>this.setState({counting : false})}/>
                                </View>
                        ) : (
                            <View>
                                <TouchableOpacity  style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>ارسال مجدد کدفعالسازی</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={styles.buttonContainer}>
                                    <Text style={styles.buttonText}>بازگشت و اصلاح شماره</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            </KeyboardAvoidingView>
        )
    }
}

class CountDownTimer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            now : this.props.start || 10
        }
    }
    componentDidMount() {
        const interval = this.props.interval || 1
        var now = 0
        let timer = setInterval(()=>{
            now = this.state.now
            if (now<=(this.props.stop || 0)) {
                clearInterval(timer)
                this.props.onFinish()
            }
            else {
                now = now - interval
                this.setState({now})
            }
        },interval*1000)
    }

    render() {
        return <Text>{this.state.now}</Text>
    }
}

const AuthStack = createStackNavigator(
    {
        
        SignInorRegister,
        Verification,
    }
)


const styles = StyleSheet.create({
    container : {
        flex : 1,
        paddingTop: getStatusBarHeight(),
        backgroundColor : 'rgba(255, 255, 255, 1)',
    },
    logoContainer : {
        flex : 1,
        flexGrow : 1,
        justifyContent : 'center',
        alignItems:'center',       
    },
    formContainer : {
        padding : 50
    },
    buttonContainer : {
        marginBottom : 10 ,
        backgroundColor : 'rgba(8, 129, 163, 1)',
        paddingVertical : 15
    },
    buttonText : {
        justifyContent : 'center',
        textAlign : 'center',
        color : "#fff"
    },
    activationContainer : {
        padding : 50,
        flex : 1,
        justifyContent : 'center',

    }
    
})

export default AuthStack