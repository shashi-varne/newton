import React, { Component } from 'react';
import Container from '../common/Container';
import { navigate } from '../common/commonFunctions';
import { fetchFHCData } from '../common/ApiCalls';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import toast from '../../common/ui/Toast';
import WVInfoBubble from '../../common/ui/InfoBubble';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            productName: getConfig().productName,
        };
        this.navigate = navigate.bind(this);
    }

    async componentDidMount() {
        try {
            let params = this.props.location.params || {};
            if (params.refresh || params.fromScreen1) {
                // Do nothing
            } else {
                const fhc_data = await fetchFHCData();
                if (fhc_data.completed_v2) {
                    this.navigate('/fhc/final-report');
                }
            }
            this.setState({ show_loader: false });
        } catch (err) {
            console.log(err);
            toast(err);
        }
    }

    startFHC() {
        this.sendEvents('next');
        this.navigate('/fhc/personal1');
    }

    sendEvents(user_action) {
        let { params } = this.props.location;
        let eventObj = {
            "event_name": 'fhc',
            "properties": {
                "user_action": user_action,
                "screen_name": 'fhc',
                "source": (params || {}).refresh ? 'refresh' : 'invest_home',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                buttonTitle="Start"
                handleClick={() => this.startFHC()}
                title="Fin Health Check (FHC)"
                fullWidthButton={true}
                onlyButton={true}
            >
                <div className="landing-container">
                    <WVInfoBubble
                        type="warnin"
                        isDismissable
                        hasTitle
                    >
                    </WVInfoBubble>
                    <img
                        src={require(`assets/fhc_landing.svg`)}
                        className="landing-img"
                        alt="Health Check Banner" />
                    <div className="landing-text">
                        Managing your finances is<br />as important as your health.
                        </div>
                </div>
            </Container>
        );
    }
}

export default Landing;