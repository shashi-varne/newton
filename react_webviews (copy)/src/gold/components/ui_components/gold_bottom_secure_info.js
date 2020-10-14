import React, { Component } from 'react';

import { getConfig } from 'utils/functions';

class GoldBottomSecureInfoClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
            provider: this.props.parent.state.provider || ''
        }
    }

    render() {
        return (
            <div style={this.props.style} className="gold-bottom-secure-info">
                <div className="content">
                    100% Secure  |  Transparent  |  Convenient
              </div>

                <div className="images">
                    <img className="icon" src={require(`assets/logo_idbi.svg`)} alt="Gold" />
                    {(this.props.parent.state.provider === 'safegold' || !this.props.parent.state.provider) && 
                    <img className="icon" src={require(`assets/brinks_logo.svg`)} alt="Gold" />}
                    {(this.props.parent.state.provider === 'mmtc' || !this.props.parent.state.provider) && 
                    <img className="icon" src={require(`assets/logo_lbma.svg`)} alt="Gold" />}
                </div>
            </div>
        );
    }
}

const GoldBottomSecureInfo = (props) => (
    <GoldBottomSecureInfoClass
        {...props} />
);

export default GoldBottomSecureInfo;