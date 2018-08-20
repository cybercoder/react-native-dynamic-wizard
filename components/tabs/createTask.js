import React,{Component} from 'react'
import {View,Text, ActivityIndicator} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {createStackNavigator} from 'react-navigation'
import axios from 'axios'
import config from '../../config'

import LoadServices from './loadServices'
import Wizard from './wizard'

class TaskWizard extends Component {
    constructor(props){
        super(props)
        
    }
    render() {
        const screenProps = {
            ...this.props.navigation.state.params,
            goBack : ()=>{
                this.props.navigation.goBack()
            }
        }
        
        return (
            <Wizard screenProps={screenProps}/>
        )
    }
}

class CreateTask extends Component {
    static navigationOptions = {
        tabBarIcon : ({tintColor})=>(
            <Icon name="ios-add-circle-outline" style={{color : tintColor}} size={30}></Icon>
        )
    }
    constructor(props) {
        super(props)

        this.state={
            loading : true,
            tree : []
        }

        axios.get(`${config.ServerURI}/api/category/tree`)
        .then(res=>{
            this.setState({
                loading : false,
                tree : res.data
            })
        },()=>console.log(res.data))
    }
    render() {
        if (this.state.loading)
            return(<ActivityIndicator/>)
        return (
            <CreateTaskStack screenProps={{tree : this.state.tree}}/>
        )
    }
}

const CreateTaskStack = createStackNavigator({
    LoadServices   : LoadServices,
    TaskWizard : TaskWizard
})

export {CreateTask}