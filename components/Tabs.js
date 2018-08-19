import React, {Component} from 'react'
import {View,Text,Platform} from 'react-native'
import {MyTasks, CreateTask} from './tabs'
import {createBottomTabNavigator} from 'react-navigation'



const Tabs = createBottomTabNavigator({
    MyTasks : {
        screen : MyTasks
    },
    CreateTask:{
        screen : CreateTask
    }
},{
    animationEnabled : true,
    swipeEnabled : true,
    tabBarPosition : "bottom",
    tabBarOptions : {
        style : {
            ...Platform.select({
                android : {
                    backgroundColor : 'white'
                }
            })
        },
        activeTintColor : "#000",
        inactiveTintColor : "#d1cece",
        showLabel : false,
        showIcon : true
    }
})

export default Tabs