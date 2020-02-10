import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import {storageService} from 'utils/validators';

class SellPriceClass extends Component {
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

            const res = await Api.get('/api/gold/sell/currentprice');
            if (res.pfwresponse.status_code === 200) {

                this.setState({
                    show_loader: false
                })
                let result = res.pfwresponse.result;
                let goldSellInfo = result.sell_info;
                var currentDate = new Date();
                let timeAvailable = ((goldSellInfo.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);

                let sellData = storageService().getObject('sellData');
                sellData.goldSellInfo = result.sell_info;
                sellData.plutusRateID = result.sell_info.plutus_rate_id;
                sellData.timeAvailable = timeAvailable;
                storageService().setObject('sellData', sellData);

                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
               

                
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
            noFooter={true}
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

const RefreshSellPrice = (props) => (
    <SellPriceClass
        {...props} />
);

export default RefreshSellPrice;