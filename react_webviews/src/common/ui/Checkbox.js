import React, { Component } from 'react'
import Checkbox from 'material-ui/Checkbox';

class CheckBox extends Component {
    render() {
        return (
            <Checkbox 
                type={this.props.type} 
                className={`${this.props.class} Checkbox`} 
                onChange={() => this.props.handleChange(this.props.index)} 
                value={this.props.value} 
                checked={this.props.checked} 
                color="primary"
                style={{height: `${this.props.height}`, width: `${this.props.width}`, 
                left: 0}}
            />                
        )
    }
}

export default CheckBox;
