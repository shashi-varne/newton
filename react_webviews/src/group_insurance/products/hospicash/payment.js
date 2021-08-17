import React, { Component } from 'react';
import { Fragment } from 'react';
import Payment from '../../ui_components/general_insurance/payment';

class HospicashPlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'HOSPICASH'
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

export default HospicashPlanPayment;