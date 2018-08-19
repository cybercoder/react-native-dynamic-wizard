import React,{Component} from 'react'
import {View,Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

class CreateTask extends Component {
    static navigationOptions = {
        tabBarIcon : ({tintColor})=>(
            <Icon name="ios-add-circle-outline" style={{color : tintColor}} size={30}></Icon>
        )
    }
    render() {
        return (
            <View style={{backgroundColor : 'yellow', flex : 1, alignContent : 'center',alignItems:'center'}}>
                <Text>
                    My Tasks
                </Text>
            </View>
        )
    }
}

export {CreateTask}