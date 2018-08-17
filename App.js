import React, {Component} from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

import Wizard from './components/wizard'
import ElementRender from './components/formRender/elementRender'

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
      name: "Pipe",
      label : "خرابی از چه نوع است؟",
      type : "multiselect",
      choices : [
        'ترکیدگی لوله',
        'نشتی',
        'گرفتگی',
        'قاط زده',
        'سیفون نمیره',
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

export default class App extends Component {
  render() {
    return (
      <Wizard screenProps={{service}}/>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecec',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
