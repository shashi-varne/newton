import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName,
        };
    }
    startFHC() {
        this.sendEvents('next');
        this.navigate('/fhc/personal1');
    }

    sendEvents(user_action) {
        let eventObj = {
            "event_name": 'fhc',
            "properties": {
                "user_action": user_action,
                "screen_name": 'fhc',
                "source": '',
            }
        };

        if (user_action === 'just_set_events') {
            return eventObj;
        } else {
            nativeCallback({ events: eventObj });
        }
    }

    navigate(pathname, search) {
        this.props.history.push({
            pathname: pathname,
            search: search ? search : getConfig().searchParams,
            params: {
                fromHome: true
            }
        });
    }
    render() {
        return (
            <Container
                buttonTitle="Start"
                handleClick={() => this.startFHC()}
                title="Fin Health Check (FHC)"
                >
                    <div className="landing-container">
                        <img
                            src={require(`assets/fisdom/fhc_landing.svg`)}
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