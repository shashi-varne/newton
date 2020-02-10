import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import {storageService} from 'utils/validators';

class BuyPriceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            openConfirmDialog: false,
            openPriceChangedDialog: true,
            provider: this.props.parent.state.provider,
        }
    }

    async componentDidMount() {

        try {

            if(!this.props.parent.state.fetchLivePrice) {
                this.setState({
                    show_loader: true
                })
            }

            const res = await Api.get('/api/gold/buy/currentprice');
            if (res.pfwresponse.status_code === 200) {
                let result = res.pfwresponse.result;
                let goldBuyInfo = result.buy_info;
                var currentDate = new Date();
                let timeAvailable = ((goldBuyInfo.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);


                let buyData = storageService().getObject('buyData');
                buyData.goldBuyInfo = result.buy_info;
                buyData.plutusRateID = result.buy_info.plutus_rate_id;
                buyData.timeAvailable = timeAvailable;
                storageService().setObject('buyData', buyData);

                console.log("yo")
                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
                this.setState({
                    show_loader: false
                })

            } else {
                this.setState({
                    show_loader: false
                });
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong', 'error');
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
        return(
            <Container
            showLoader={this.state.show_loader}
            loaderData= {
                {
                    'loaderClass': 'Loader-Dialog',
                    'loadingText': 'Wait for a moment...'
                }
            }
                >
            </Container>
        )
    }

}

const RefreshBuyPrice = (props) => (
    <BuyPriceClass
        {...props} />
);

export default RefreshBuyPrice;