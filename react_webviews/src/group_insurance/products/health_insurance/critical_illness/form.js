import React, { Component } from 'react';
import { Fragment } from 'react';
import BasicDetailsRedirection from '../../../ui_components/general_insurance/basic_details_redirection';

class HealthCriticalIllnessForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_key: 'CRITICAL_HEALTH_INSURANCE',
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

export default HealthCriticalIllnessForm;