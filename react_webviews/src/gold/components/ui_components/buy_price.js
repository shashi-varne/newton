import React, { Component } from 'react';

import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import Container from '../../common/Container';
import {storageService} from 'utils/validators';

// eslint-disable-next-line
import {getUpdatedBuyData} from '../../constants';

class BuyPriceClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show_loader: false,
            provider: this.props.parent.state.provider,
        }
    }

    resetTimer(buyData) {
        buyData.goldBuyInfo = {};
        buyData.plutus_rate_id = '';
        buyData.timeAvailable = 0;

        return buyData;
    }
    async componentDidMount() {

        let buyData = storageService().getObject('buyData') || {};
        try {

            if(!this.props.parent.state.fetchLivePrice) {
                this.setState({
                    show_loader: true
                })
            }

            this.props.parent.updateParent('price_crashed', false);

            const res = await Api.get('/api/gold/buy/currentprice/' + this.state.provider);
            if (res.pfwresponse.status_code === 200) {
                
                
                let result = res.pfwresponse.result;
                let goldBuyInfo = result.buy_info;
                var currentDate = new Date();
                let timeAvailable = ((goldBuyInfo.rate_validity - currentDate.getTime()) / 1000 - 330 * 60);

                
                buyData.goldBuyInfo = result.buy_info;
                buyData.provider = this.state.provider;
                buyData.plutus_rate_id = result.buy_info.plutus_rate_id;
                buyData.timeAvailable = timeAvailable;

                // getUpdatedBuyData(buyData);

                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
                this.props.parent.updateParent('show_loader', false);

            } else {

                buyData = this.resetTimer(buyData);
                this.props.parent.onload();
                this.props.parent.updateParent('fetchLivePrice', false);
                this.props.parent.updateParent('show_loader', false);
                this.props.parent.updateParent('price_crashed', true);
                toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
            }
            this.setState({
                show_loader: false
            })

        } catch (err) {
            buyData = this.resetTimer(buyData);
            console.log(err);
            this.setState({
                show_loader: false
            });
            toast('Something went wrong');
        }

        storageService().setObject('buyData', buyData);
    }

    render() {
        if(!this.state.show_loader) {
            return null;
        }
        
        return(
            <Container
            noFooter={true}
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