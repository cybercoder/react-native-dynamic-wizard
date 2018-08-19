import React, {Component} from 'react'
import {View,Text,AsyncStorage} from 'react-native'
import {createStackNavigator} from 'react-navigation'
import {Button,Card} from 'react-native-elements'


class SignInorRegister extends Component {
    _signInAsync = async () => {
        await AsyncStorage.setItem('userToken', 'abc');
        this.props.navigation.navigate('App');
    };

    render() {
        return(
            <View>
                <Card title="شماره همراه خود را وارد کنید">
                    <Button title={`ادامه`} onPress={this._signInAsync}/>                
                </Card>
            </View>
        )
    }
}

class Verification extends Component {
    render() {
        return(
            <View>
                <Text>Verification</Text>
            </View>
        )
    }
}

const AuthStack = createStackNavigator(
    {
        SignInorRegister,
        Verification
    }
)

export default AuthStack