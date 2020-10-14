import React, { Component } from 'react';
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
            <div>
                <Payment
                    parent={this}
                />
            </div>
        );
    }
}

export default SmartwalletPlanPayment;