import React,{Component} from 'react'
import {View,Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

class MyTasks extends Component {
    static navigationOptions = {
        tabBarIcon : ({tintColor})=>(
            <Icon name="ios-home" style={{color : tintColor}} size={30}></Icon>
        )
    }
    render() {
        return (
            <View>
                <Text>
                    My Tasks
                </Text>
            </View>
        )
    }
}

export {MyTasks}