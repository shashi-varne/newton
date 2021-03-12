import React, { Component } from 'react';
import { Fragment } from 'react';
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
            <Fragment>
                <Payment
                    parent={this}
                />
            </Fragment>
        );
    }
}

export default AccidentPlanPayment;