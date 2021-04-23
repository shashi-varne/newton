import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import { getConfig, getBasePath } from 'utils/functions';
import { storageService } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';

class PlaceBuyOrderClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            provider: this.props.parent.state.provider ||
                this.props.parent.props.match.params.provider,
            buyData: storageService().getObject('buyData')
        }
    }

    componentWillMount() {
        nativeCallback({ action: 'take_control_reset' });
    }

    redirect(pgLink) {
        let basepath = getBasePath();
        let nativeRedirectUrl = basepath +
            '/gold/buy' + getConfig().searchParams;
        
        let paymentRedirectUrl = encodeURIComponent(
            basepath + '/gold/' + this.state.provider + '/buy/payment' + getConfig().searchParams
        );

        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl + '&back_url=' +
         encodeURIComponent(nativeRedirectUrl) + '&order_type=buy' + '&generic_callback=' + getConfig().generic_callback;

        if (getConfig().app === 'ios') {
            nativeCallback({
                action: 'show_top_bar', message: {
                    title: 'Payment'
                }
            });
        }

        if (getConfig().isNative) {
            nativeCallback({
                action: 'take_control', message: {
                    back_url: nativeRedirectUrl,
                    back_text: 'Are you sure you want to exit the payment process?'
                }
            });
        } else {
            nativeCallback({
                action: 'take_control', message: {
                    back_url: nativeRedirectUrl,
                    back_text: ''
                }
            });
        }

        window.location.href = pgLink;
    }

    async componentDidMount() {

        var options = {
            plutus_rate_id: this.state.buyData.goldBuyInfo.plutus_rate_id,
            buy_price: parseFloat(this.state.buyData.amount_selected),
            buy_weight: this.state.buyData.weight_selected,
            inputMode: this.state.buyData.inputMode
        }

        this.props.parent.updateParent('show_loader', true);
        let pathname = this.props.parent.props.history.location.pathname;

        try {

            const res = await Api.post('/api/gold/user/buy/verify/' + this.state.provider, options);

            let result = res.pfwresponse.result;
            let buyData = this.state.buyData;

            if(result.pan_needed) {
                this.props.parent.navigate('/gold/' + this.state.provider + '/buy-pan');
            } else if (res.pfwresponse.status_code === 200 &&
                result.payment_details.plutus_rate !== this.state.buyData.goldBuyInfo.plutus_rate) {

                buyData.goldBuyInfo.rate_validity = 0;
                storageService().setObject('buyData', buyData);
                this.props.parent.updateParent('show_loader', false);
                this.props.parent.updateParent('proceedForOrder', false);
            } else if (res.pfwresponse.status_code === 200 &&
                result.payment_details.plutus_rate === this.state.buyData.goldBuyInfo.plutus_rate) {

                buyData.payment_details = result.payment_details;
                buyData.transact_id = result.payment_details.transact_id;
                storageService().setObject('buyData', buyData);

                var payment_link = result.payment_details.payment_link;
                this.redirect(payment_link);
                return;

            } else {
                this.props.parent.updateParent('show_loader', false);
                this.props.parent.updateParent('proceedForOrder', false);
                toast(result.error || result.message ||
                    'Something went wrong');

                if(pathname !== '/gold/buy') {
                    this.props.parent.navigate('/gold/buy');
                }
            }
        } catch (err) {
            console.log(err);
            this.props.parent.updateParent('show_loader', false);
            this.props.parent.updateParent('proceedForOrder', false);
            toast('Something went wrong');
        }
    }

    render() {
        return null;
    }

}

const PlaceBuyOrder = (props) => (
    <PlaceBuyOrderClass
        {...props} />
);

export default PlaceBuyOrder;