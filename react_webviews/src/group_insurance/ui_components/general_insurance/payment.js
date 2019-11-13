import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import qs from 'qs';
import { getConfig } from 'utils/functions';



class PaymentClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loadeR: true,
            params: qs.parse(this.props.parent.props.history.location.search.slice(1))
        };
    }

    componentWillMount() {

        const { status } = this.props.parent.props.match.params;

        console.log(status)
        let stateMapper = {
            'PERSONAL_ACCIDENT' : 'accident'
        };

        let path = '/group-insurance/' + stateMapper[this.props.parent.state.product_key] + '/'
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
              disableBack : true
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