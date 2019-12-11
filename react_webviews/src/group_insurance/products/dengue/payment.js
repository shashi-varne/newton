import React, { Component } from 'react';
import Payment from '../../ui_components/general_insurance/payment';

class DenguePlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'DENGUE'
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

export default DenguePlanPayment;