import React, { Component } from 'react';
import Payment from '../../ui_components/general_insurance/payment';

class CoronaPlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'CORONA'
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

export default CoronaPlanPayment;