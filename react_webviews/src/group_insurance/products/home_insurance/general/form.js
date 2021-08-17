import React, { Component } from 'react';
import BasicDetailsRedirection from '../../../ui_components/general_insurance/basic_details_redirection';

class HomeInsuranceForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'HOME_INSURANCE',
            provider: 'hdfcergo',
            integeration_type: 'redirection',
        }
    }

    render() {
        return (
            // <div>
                <BasicDetailsRedirection
                    parent={this}
                />
            // </div>
        );
    }
}

export default HomeInsuranceForm;