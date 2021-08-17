import React, { Component } from 'react';

class InputPrefix extends Component {
    
    render(){
        return(
            <div className="input-prefix-container">
                {this.props.showPrefix && <span className="input-prefix-character">{this.props.prefix}</span>}
                {this.props.children}
            </div>
        )
    }
}

export default InputPrefix;

