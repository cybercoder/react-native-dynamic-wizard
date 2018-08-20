import React, { Component } from 'react'
import { View, Text } from 'react-native'
import SelectMultiple from 'react-native-select-multiple'

const renderLabel = (label, style) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View style={{marginLeft: 10}}>
        <Text style={style}>{label}</Text>
      </View>
    </View>
  )
}
 
class MultiSelect extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data : {
        ...this.props.field,
        values : [
          // {
          //   label : this.props.field.choices[0],
          //   value : this.props.field.choices[0]
          // }
        ]
      }
    }
    this.callPropsOnchange()

  }
  callPropsOnchange() {
    if (this.props.onChange) this.props.onChange(this.state.data.values)
  }  
 
  onSelectionsChange = (selectedChoices) => {
    // if (selectedChoices.length===0)
    // selectedChoices[0] = {
    //   label : this.props.field.choices[0],
    //   value : this.props.field.choices[0]
    // }
    
    // selectedChoices is array of { label, value }
    this.setState({
        data : {
            ...this.state.data,
            values : selectedChoices
        }
    },()=>{this.callPropsOnchange()})
  }
 
  render () {
    return (
        <SelectMultiple
          items={this.props.field.choices}
          renderLabel={renderLabel}
          selectedItems={this.state.data.values}
          onSelectionsChange={this.onSelectionsChange} />
    )
  }
}

export {MultiSelect}