import React, { Component } from 'react';
import fhc_img from 'assets/fisdom/fhc_landing.svg';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';

class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            landingImg: fhc_img,
            productName: getConfig().productName,
        };
    }
    startFHC() {
        console.log('BUTTON CLICKED!!!!', this);
        this.navigate('/fhc/personal1');
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
                            src={require(`assets/${this.state.productName}/fhc_landing.svg`)}
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