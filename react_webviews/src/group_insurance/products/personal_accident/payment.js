import React, { Component } from 'react';
import Payment from '../../ui_components/general_insurance/payment';

class AccidentPlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'PERSONAL_ACCIDENT'
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

export default AccidentPlanPayment;