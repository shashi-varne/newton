import React, { Component } from 'react';
import Container from '../../common/Container';
import { navigate } from '../../common/commonFunctions';
import { getConfig } from 'utils/functions';
import FHC from '../../FHCClass';
import { storageService } from '../../../utils/validators';

class Success extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            productName: getConfig().productName,
        };
        this.navigate = navigate.bind(this);
    }

    componentDidMount() {
        let fhc_data = new FHC(storageService().getObject('fhc_data'));
        this.setState({
            show_loader: false,
            name: fhc_data.name,
        });
        setTimeout(() => {
            /* sending 3rd param (replace) as true is required to prevent this screen
             from showing up in the back sequence of 'loan1'. Also, the history stack
             is left in a way that allows a natural flow when moving back through
             subsequent or former screens
            */
            this.navigate('loan1', null, true);
        }, 2500);
    }

    render() {
        let name = this.state.name;
        return (
            <Container
                noFooter={true}
                noHeader={true}
                handleClick={() => this.startFHC()}
                title="Fin Health Check (FHC)"
                hideBack={true}
                fullWidthButton={true}
                onlyButton={true}
            >
                <div className="landing-container">
                    <img
                        src={require(`assets/done_icon.png`)}
                        className="success-img"
                        alt="Personal Details Success" />
                    <div className="success-text-container">
                        <span id="span1">
                            <b>Hey {name}!</b> Great work indeed.
                            </span>
                        <span id="span2">
                            Now, let's take a look at your<br />
                                liabilities, coverage, and investments.
                            </span>

                    </div>
                </div>
            </Container>
        );
    }
}

export default Success;