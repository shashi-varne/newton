import React, { Component } from 'react';

import { getConfig } from 'utils/functions';

class GoldBottomSecureInfoClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName
        }
    }

    render() {
        return (
            <div className="gold-bottom-secure-info">
                <div className="content">
                    100% Secure  |  Transparent  |  Convenient
              </div>

                <div className="images">
                    <img className="icon" src={require(`assets/brinks_logo.svg`)} alt="Gold" />
                    <img className="icon" src={require(`assets/logo_idbi.svg`)} alt="Gold" />
                    <img className="icon" src={require(`assets/logo_lbma.svg`)} alt="Gold" />
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