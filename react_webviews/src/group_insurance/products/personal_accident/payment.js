import React, { Component } from 'react';
import Payment from '../../ui_components/general_insurance/payment';
import qs from 'qs';
import { getConfig } from 'utils/functions';

class AccidentPlanPayment extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show_loader: true,
            params: qs.parse(props.history.location.search.slice(1))
        }
    }

    componentWillMount() {

        const { status } = this.props.match.params;

        console.log(status)
        if (status === 'success') {
            this.navigate('');
        } else {
            this.navigate('')
        }

    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    render() {
        return (
            <div>
                <Payment

                />
            </div>
        );
    }
}

export default AccidentPlanPayment;