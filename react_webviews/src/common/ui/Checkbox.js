import React, { Component } from 'react'

class Checkbox extends Component {
    render() {
        return (
            <input 
                type={this.props.type} 
                className={this.props.class} 
                onChange={() => this.props.handleChange(this.props.index)} 
                value={this.props.value} 
                checked={this.props.checked} 
                style={{height: `${this.props.height}`, width: `${this.props.width}`}}/>                
        )
    }
}

export default Checkbox;
