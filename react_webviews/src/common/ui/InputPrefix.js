import React, { Component, Fragment } from 'react';

class InputPrefix extends Component {
    
    render(){
        return(
            <Fragment>
                {this.props.showPrefix && <span className="input-prefix-character">{this.props.prefix}</span>}
                {this.props.children}
            </Fragment>
        )
    }
}

export default InputPrefix;

