import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import { storageService } from '../../../utils/validators';
import FHC from '../../FHCClass';

class InvestSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            name: '',
        };
    }

    async componentDidMount() {
        let fhc_data = new FHC(storageService().getObject('fhc_data'));
        this.setState({
            show_loader: false,
            name: fhc_data.name,
        });
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
        let { name } = this.state;
        return (
            <Container
                showLoader={this.state.show_loader}
                buttonTitle="Check Results"
                handleClick={() => this.navigate('final-report')}
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