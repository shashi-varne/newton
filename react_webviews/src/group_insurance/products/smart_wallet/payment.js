import React, { Component } from 'react';
import { Fragment } from 'react';
import Payment from '../../ui_components/general_insurance/payment';

class SmartwalletPlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'SMART_WALLET'
        }
    }

    
    render() {
        return (
            <Fragment>
                <Payment
                    parent={this}
                />
            </Fragment>
        );
    }
}

export default SmartwalletPlanPayment;