import React, { Component } from 'react';
import BasicDetailsRedirection from '../../../ui_components/general_insurance/basic_details_redirection';

class HealthSuperTopupForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'HEALTH_SUPER_TOPUP',
            provider: 'hdfcergo',
            integeration_type: 'redirection',
        }
    }

    render() {
        return (
            <div>
                <BasicDetailsRedirection
                    parent={this}
                />
            </div>
        );
    }
}

export default HealthSuperTopupForm;