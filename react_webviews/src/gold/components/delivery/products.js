import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
// import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import GoldProviderFilter from '../ui_components/provider_filter';
import { default_provider, gold_providers, isUserRegistered } from '../../constants';
import { storageService, inrFormatDecimal2} from 'utils/validators';

const stepsContentMapper = [
  { 'icon': 'ic_gold_provider', 'content': 'How to get gold coin delivered?' },
  { 'icon': 'ic_make_payment', 'content': '2. Pay making charges' },
  { 'icon': 'deliver', 'content': '3. Get home delivery' }
];

class GoldDeliveryProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: true,
      gold_products: [],
      gold_providers: gold_providers,
      orderType: 'delivery',
      provider: storageService().get('gold_provider') || default_provider,
      user_info: {},
      provider_info: {},
      productName: getConfig().productName,
      redirect_state: 'delivery-products'
    }
  }


  async componentDidMount() {

    let isRegistered;
    try {

      const res = await Api.get('/api/gold/user/account/' + this.state.provider);
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        isRegistered = isUserRegistered(result);
        this.setState({
          provider_info: result.gold_user_info.provider_info || {},
          user_info: result.gold_user_info.user_info || {},
          // maxWeight: parseFloat(result.gold_user_info.safegold_info.gold_balance).toFixed(4),
          isRegistered: isRegistered
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res.pfwresponse.result.error || res.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res.pfwresponse.result.error || res.pfwresponse.result.message ||
        //   'Something went wrong');
      }

      const res4 = await Api.get('/api/gold/delivery/products/' + this.state.provider);
      if (res4.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
          gold_products: res4.pfwresponse.result.delivery_products
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
        //   'Something went wrong');
      }

      if(isRegistered) {
        const res3 = await Api.get('/api/gold/user/sell/balance/' + this.state.provider);

        if (res3.pfwresponse.status_code === 200) {
  
          let result = res3.pfwresponse.result;
          let maxWeight = parseFloat(result.sellable_gold_balance || 0).toFixed(4);
          this.setState({
            maxWeight: maxWeight
          });
        } else {
          this.setState({
            // show_loader: false,
            error: true,
            errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
              'Something went wrong'
          });
          // toast(res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
          //   'Something went wrong');
        }
      } 
    } catch (err) {
      console.log(err);
      this.setState({
        show_loader: false,
        error: true,
        errorMessage: 'Something went wrong'
      });
      // toast('Something went wrong');
    }

    this.setState({
      show_loader: false
    });
  }

  sendEvents(user_action, current_data={}) {
    let eventObj = {
      "event_name": 'gold_investment_flow',
      "properties": {
        "user_action": user_action,
        "screen_name": 'select_gold_coin',
        "provider": this.state.provider || '',
        "faq_clicked": this.state.faq_clicked ? 'yes' : 'no',
        "change_provider": current_data.change_provider ? 'yes' : 'no',
        "selected_coin": current_data.select_coin ? current_data.select_coin + ' gms' : ''
      }
      
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  selectGoldProduct(index) {
    this.sendEvents('next', {select_coin : this.state.gold_products[index].metal_weight});

    let selectedProduct = this.state.gold_products[index];
    storageService().setObject('deliveryData', selectedProduct);

    this.navigate(this.state.provider + '/select-gold-product');
  };


  
  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }

  renderDeliveryProducts =(props, index)  =>{
    return (
      <div key={index} onClick={() => this.selectGoldProduct(index)} className="delivery-tile">
        <img alt="Gold" className="delivery-icon" src={props.media.images[0]} width="80" />

        <div className="disc">{props.description}</div>
        <div className="making-charges">Making charges</div>
        <div className="making-cost">{inrFormatDecimal2(props.delivery_minting_cost)}</div>
      </div>
    )
  }

  updateChild = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  showHideSteps() {
    this.setState({
      showSteps: !this.state.showSteps,
      faq_clicked: true
    })
  }

  renderInfoSteps =(props, index) => {
    return(
      <div key={index} className="tile">
        <img className="icon" 
        src={require(`assets/${this.state.productName}/${props.icon}.svg`)} alt="Gold" />
        <div className="content">
          {props.content}
        </div>
      </div>
    );
  }

  render() {

    return (
      <Container
        showLoader={this.state.show_loader}
        noFooter={true}
        events={this.sendEvents('just_set_events')}
        headerType="provider-filter"
        title={'Deliver gold: ' + this.state.gold_providers[this.state.provider].title}
        updateChild={this.updateChild}
      >
        
        <GoldProviderFilter parent={this} />
      <div className="gold-delivery-products" id="goldSection">

        <div className="generic-page-title">
        Select gold coin
        </div>
        <div className="delivery-products-tiles">
            {this.state.gold_products && this.state.gold_products.map(this.renderDeliveryProducts)}
        </div>

        {/* <div className="show-more">
          SHOW MORE
        </div> */}

        <div className="gold-how-steps pointer" onClick={() => this.showHideSteps()}>
            <div className="top-tile">
              <div className="top-title">
              How to get gold coin delivered?
              </div>
              <div className="top-icon">
                <img src={ require(`assets/${this.state.showSteps ? 'minus_icon' : 'plus_icon'}.svg`)} alt="Gold" />
              </div>
            </div>


          {this.state.showSteps &&
            <div className='gold-steps-images'>
              {stepsContentMapper.map(this.renderInfoSteps)}
            </div>
          }
        </div>

        <GoldBottomSecureInfo parent={this} />
      </div>
      </Container>
    );
  }
}

export default GoldDeliveryProducts;
