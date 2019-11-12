import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';

class PaymentClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {

    }

    render() {
        return (
            <Container
                title="Success"
                classOverRideContainer="plan-success"
                showLoader={true}
                hide_header={true}
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