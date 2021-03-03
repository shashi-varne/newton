import React, { Component } from 'react';
import Container from '../../common/Container';
import { navigate } from '../../common/commonFunctions';
import { storageService } from '../../../utils/validators';
import FHC from '../../FHCClass';
import { nativeCallback } from 'utils/native_callback';

class InvestSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            name: '',
        };
        this.navigate = navigate.bind(this);
    }

    async componentDidMount() {
        let fhc_data = new FHC(storageService().getObject('fhc_data'));
        this.setState({
            show_loader: false,
            name: fhc_data.name,
        });
    }

    sendEvents = (user_action) => {
        let eventObj = {
            "event_name": 'fhc',
            "properties": {
                "user_action": user_action,
                "screen_name": 'fhc result',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    handleClick = () => {
        this.sendEvents('next');
        this.navigate('final-report');
    }

    render() {
        let { name } = this.state;
        return (
            <Container
                events={this.sendEvents('just_set_events')}
                showLoader={this.state.show_loader}
                buttonTitle="Check Results"
                handleClick={this.handleClick}
                title="Fin Health Check (FHC)"
            >
                <div className="landing-container">
                    <img
                        src={require(`assets/done_icon.png`)}
                        className="success-img"
                        alt="Personal Details Success" />
                    <div className="success-text-container">
                        <span id="span1">
                            <b>Hey {name}!</b> Superb.
                            </span>
                        <span id="span2">
                            As per the information provided 
                            please check the results of your financial health.
                        </span>
                    </div>
                </div>
            </Container>
        );
    }
}

export default InvestSuccess;