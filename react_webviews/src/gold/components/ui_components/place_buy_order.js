import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import {getConfig} from 'utils/functions';
import { storageService } from 'utils/validators';

class PlaceBuyOrderClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            openConfirmDialog: false,
            openPriceChangedDialog: true,
            provider: this.props.parent.props.match.params.provider,
            buyData: storageService().getObject('buyData')
        }
    }

    redirect(pgLink) {
        let nativeRedirectUrl = window.location.origin +
            '/gold/' + this.state.provider + '/buy-gold-order' + getConfig().searchParams;

        let paymentRedirectUrl = encodeURIComponent(
            window.location.origin + '/gold/' + this.state.provider + '/buy/payment' + getConfig().searchParams
        );

        // eslint-disable-next-line
        pgLink += (pgLink.match(/[\?]/g) ? '&' : '?') + 'plutus_redirect_url=' + paymentRedirectUrl + '&back_url=' + encodeURIComponent(nativeRedirectUrl) + '&order_type=buy';
        if (getConfig().generic_callback) {
            pgLink += '&generic_callback=' + getConfig().generic_callback;
        }
        window.location = pgLink;
    }

    async componentDidMount() {

        var options = {
            plutus_rate_id: this.state.buyData.goldBuyInfo.plutus_rate_id,
            buy_price: parseFloat(this.state.buyData.amount_selected)
        }

        this.props.parent.updateParent('show_loader', true);

        try {

            const res = await Api.post('/api/gold/user/buy/verify', options);

            if (res.pfwresponse.status_code === 200 &&
                res.pfwresponse.result.payment_details.plutus_rate === this.state.buyData.goldBuyInfo.plutus_rate) {
                let result = res.pfwresponse.result;
                var payment_link = result.payment_details.payment_link;
                this.redirect(payment_link);
                return;

            } else if (res.pfwresponse.result.is_gold_rate_changed) {
                let new_rate = res.pfwresponse.result.new_rate;
                let amountUpdated, weightUpdated;
                if (this.state.isAmount) {
                    amountUpdated = this.state.amount;
                    weightUpdated = this.calculate_gold_wt(new_rate.plutus_rate,
                        new_rate.applicable_tax, this.state.amount);
                } else {
                    weightUpdated = this.state.weight;
                    amountUpdated = this.calculate_gold_amount(new_rate.plutus_rate,
                        new_rate.applicable_tax, this.state.weight);
                }
                this.setState({
                    show_loader: false,
                    amountUpdated: amountUpdated,
                    weightUpdated: weightUpdated,
                    new_rate: new_rate,
                    openPopup: true
                });
            } else {
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
                    'Something went wrong', 'error');
            }
        } catch (err) {
            console.log(err);
            this.setState({
                show_loader: false
            });
            toast('Something went wrong', 'error');
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