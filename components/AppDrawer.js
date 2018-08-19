import React from 'react'
import {createDrawerNavigator} from 'react-navigation'

import Tabs from './Tabs'

const AppDrawerNavigator = createDrawerNavigator({
    Tabs: Tabs,
    //Other: OtherScreen,
  },{
      // contentComponent: Profile,
      drawerBackgroundColor: "#437F82"
  })

export default AppDrawerNavigator