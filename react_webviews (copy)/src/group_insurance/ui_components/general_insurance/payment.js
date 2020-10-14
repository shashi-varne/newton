import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import qs from 'qs';
import { getConfig } from 'utils/functions';
import { insuranceStateMapper } from '../../constants';
import { nativeCallback } from 'utils/native_callback';

class PaymentClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loadeR: true,
            params: qs.parse(this.props.parent.props.history.location.search.slice(1))
        };
    }

    componentWillMount() {

        nativeCallback({ action: 'take_control_reset' });
        const { status } = this.props.parent.props.match.params;

        let path = '/group-insurance/' + insuranceStateMapper[this.props.parent.state.product_key] + '/'
        if (status === 'success') {
            path += 'payment-success';
        } else {
            path += 'payment-failed';
        }

        this.navigate(path)
    }

    navigate = (pathname) => {
        this.props.parent.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams,
            params: {
                disableBack: true
            }
        });
    }


    render() {
        return (
            <Container
                title="Success"
                classOverRideContainer="plan-success"
                showLoader={true}
                hide_header={true}
                product_key={this.props.parent ? this.props.parent.state.product_key : ''}
            >
            </Container>
        );
    }
}

const Payment = (props) => (
    <PaymentClass
        {...props} />
);


export default Payment;