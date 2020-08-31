import React, { Component } from 'react';
import './style.scss';

import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class TermsAndConditionsClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    render() {
        return (
            <div className="CheckBlock2 generic-terms" style={{}}>
                <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                        <Checkbox
                            defaultChecked
                            checked={this.props.parent.state.checked}
                            color="default"
                            value="checked"
                            name="checked"
                            // onChange={() => console.log('Clicked')}
                            className="Checkbox" />
                    </Grid>
                    <Grid item xs={11}>
                        <div className="generic-terms-text" style={{}}>
                            I accept <span onClick={() => this.props.parent.openInBrowser('terms_and_conditions')} className="generic-terms-bold">
                                Terms and conditions</span></div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const TermsAndConditions = (props) => (
    <TermsAndConditionsClass
        {...props} />
);

export default TermsAndConditions;