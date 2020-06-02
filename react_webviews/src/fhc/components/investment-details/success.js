import React, { Component } from 'react';
import Container from '../../common/Container';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import { toast } from 'react-toastify';

class InvestSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            name: '',
            fhc_data: '',
        };
    }

    async componentDidMount() {
        let fhc_data = JSON.parse(window.localStorage.getItem('fhc_data'));
        // Upload Data 
        try {
            if (fhc_data) {
                await Api.post('api/financialhealthcheck/mine', fhc_data);
            }
            this.setState({
                show_loader: false,
                name: fhc_data.name,
                fhc_data,
            });
        } catch (e) {
            console.log(e);
            toast('Something went wrong. Please try again');
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