import React, {Component} from 'react';
import { I18nManager } from 'react-native';
import {createSwitchNavigator} from 'react-navigation'

import TokenCheck from './components/TokenCheck'
import AuthStack from './components/Auth'
import AppDrawer from './components/AppDrawer'

I18nManager.forceRTL(true)

const service = 	{
  id: 1,
  title: "رنگ مو",
  excerpt: "رنگ مو",
  active: true,
  DynamicFields: [
    {
      name: "lastHairRootcolor",
      label : "آخرین رنگ ریشه",
      type : "select",
      choices : [
        'کمتر از یک هفته',
        'بیش از یک هفته',
        'حدود دو هفته',
        'کمتر از سه هفته',
        'حدود یک ماه',
      ]
    },
    {
      name: "HairColor",
      label : "علاقه شما به چه رنگیست؟",
      type : "multiselect",
      choices : [
        'مسی',
        'نیلی',
        'آلبالویی',
        'شرابی',
        'بلوند',
        'طلایی',
        'صدفی',
        'عنابی',
        'بادمجانی کال',
        'بادمجانی سیر',
        'مشکی',
        'قهوه ای',
        'نقره ای',
        'هویجی',
        'هیبرید',                
        'سایر'
      ]
    }    
  ],
  CategoryId: 10,
  icons: [
    "hair-salon-spray-bottle-and-can.png"
  ]
}

const row =

  {
      name : 'haircolor',
      type : 'multiselect',
      label : 'زمان از آخرین ریشه رنگ؟',
      choices : [
          'کمتر از یک هفته',
          'بیش از یک هفته',
          'حدود دو هفته',
          'کمتر از سه هفته',
          'حدود یک ماه',
      ]
  }

// export default class App extends Component {
//   render() {
//     return (
//       <Wizard screenProps={{service}}/>
//     )
//   }
// }

export default createSwitchNavigator(
  {
    TokenCheck: TokenCheck,
    App: AppDrawer,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'TokenCheck',
  }
)
