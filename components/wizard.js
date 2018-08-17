import React, {Component} from 'react'
import {StyleSheet, View,Text, } from 'react-native'
import {FormInput, Button,Card, Icon} from 'react-native-elements'
import { createStackNavigator } from 'react-navigation'
import ElementRender from './formRender/elementRender'

class FirstStep extends Component {
    constructor(props) {
        super(props)
        let {service} = this.props.screenProps
        let formData = service.DynamicFields.map((field)=>{
            return {
                label : field.label,
                value : ''
            }
        })
        let fieldCount = service.DynamicFields.length-1

        this.state={
            service : service,
            fieldCount : fieldCount,
            data : {
                location : '',
                moment : '',
                excerpt : '',
                estimatedCost : '',
                address : '',
                additionalPhone : '',
                formData : formData
            }
        }

    }

    render() {
        return (
        <Card
        title='توضیحات خود را در مورد این سرویس بنویسید'
        >
        {/* <Text style={{marginBottom: 10}}>
            {JSON.stringify(this.state.service)}
        </Text> */}
        <FormInput multiline onChangeText={(excerpt) => this.setState({data : {...this.state.data, excerpt : excerpt}})} value={this.state.data.excerpt}/>
        <Button
            icon={<Icon name='code' color='#ffffff' />}
            backgroundColor='#03A9F4'
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='ادامه'
            onPress={() => this.props.navigation.navigate('DynaStep', {
                FieldIndex : 0,
                fieldCount : this.state.fieldCount,
                data : this.state.data
            })}
            />
        </Card>
        )
    }
}

class DynaStep extends Component {
    constructor(props) {
        super(props)
        let {service} = this.props.screenProps
        let {FieldIndex, fieldCount, data} = this.getNavigationParams()
        let field = service.DynamicFields[FieldIndex]
        this.state = {
            fieldCount : fieldCount,
            FieldIndex : FieldIndex,
            field : field,
            data : data
        }
    }

    getNavigationParams() {
        return this.props.navigation.state.params || {}
    }

    onChange=(model) => {      
        let formData = this.state.data.formData
        formData[this.state.FieldIndex].value = model.map(i=>i.value)
        this.setState({
            data : {
                ...this.state.data,
                formData : formData
            }
        },()=>{
            alert(JSON.stringify(this.state.data))
        })
    }

    render() {
        return(
            <Card
            title={this.state.field.label}
            >
            <ElementRender field={this.state.field} onChange={(model)=>this.onChange(model)}/>
            {
            (this.state.FieldIndex===this.state.fieldCount) ? (
                <Button title='پایان دینامیک'/>
            ):(
            <Button
                icon={<Icon name='code' color='#ffffff' />}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                title='ادامه'
                onPress={() => this.props.navigation.push('DynaStep', {
                    FieldIndex : this.state.FieldIndex+1,
                    fieldCount : this.state.fieldCount,
                    data : this.state.data
                })}                
                />
            )
            }
            </Card>            
        )
    }
}

const Wizard = createStackNavigator({
    FirstStep: {
      screen: FirstStep
    },
    DynaStep : {
        screen : DynaStep
    }
})

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default Wizard