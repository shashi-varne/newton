import React, { Component } from 'react';
import { Fragment } from 'react';
import BasicDetailsRedirection from '../../../ui_components/general_insurance/basic_details_redirection';

class HealthSurakshaForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'HEALTH_SURAKSHA',
            provider: 'hdfcergo',
            integeration_type: 'redirection',
        }
    }

    render() {
        return (
            <Fragment>
                <BasicDetailsRedirection
                    parent={this}
                />
            </Fragment>
        );
    }
}

export default HealthSurakshaForm;