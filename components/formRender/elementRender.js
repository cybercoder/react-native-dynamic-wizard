import React, {Component} from 'react'
import {Select,MultiSelect} from './elements'

class ElementRender extends Component {
    constructor() {
      super()
    }
    render() {
      switch(this.props.field.type) {
        case 'select':
          return <Select field={this.props.field} onChange={this.props.onChange}/>
        case 'multiselect':
          return <MultiSelect field={this.props.field} onChange={this.props.onChange}/>
        default :
            return <Text>Invalid element type</Text>
      }
    }
}

export default ElementRender