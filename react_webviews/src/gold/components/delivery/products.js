import React, { Component } from 'react';

import Container from '../../common/Container';
import Api from 'utils/api';
import point_five_gm from 'assets/05gmImage.png';
import one_gm_front from 'assets/1gm_front.png';
import two_gm_front from 'assets/2gm_front.png';
import five_gm_front from 'assets/5gm_front.png';
import five_gmbar_front from 'assets/5gmbar_front.png';
import ten_gm_front from 'assets/10gm_front.png';
import ten_gmbar_front from 'assets/10gmbar_front.png';
import twenty_gmbar_front from 'assets/20gmbar_front.png';
// import toast from '../../../common/ui/Toast';
import { nativeCallback } from 'utils/native_callback';
import { getConfig } from 'utils/functions';
import GoldBottomSecureInfo from '../ui_components/gold_bottom_secure_info';
import GoldProviderFilter from '../ui_components/provider_filter';
import { default_provider, gold_providers } from '../../constants';
import { storageService} from 'utils/validators';

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
      orderType: 'deliver',
      provider: storageService().get('gold_provider') || default_provider,
      goldInfo: {},
      userInfo: {},
      productName: getConfig().productName
    }
  }


  async componentDidMount() {

    try {

      const res = await Api.get('/api/gold/user/account');
      if (res.pfwresponse.status_code === 200) {
        let result = res.pfwresponse.result;
        let isRegistered = true;
        if (result.gold_user_info.user_info.registration_status === "pending" ||
          !result.gold_user_info.user_info.registration_status ||
          result.gold_user_info.is_new_gold_user) {
          isRegistered = false;
        }
        this.setState({
          goldInfo: result.gold_user_info.safegold_info,
          userInfo: result.gold_user_info.user_info,
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
        //   'Something went wrong', 'error');
      }

      const res3 = await Api.get('/api/gold/user/sell/balance');

      if (res3.pfwresponse.status_code === 200) {

        let result = res3.pfwresponse.result;
        
        let maxWeight = parseFloat(result.sellable_gold_balance || 0).toFixed(4);
        let maxAmount = ((this.state.goldSellInfo.plutus_rate) * (maxWeight || 0)).toFixed(2);
        let weightDiffrence = this.state.goldInfo.gold_balance - maxWeight;
        let sellWeightDiffrence = false;
        if(weightDiffrence > 0) {
          sellWeightDiffrence = true
        }
        this.setState({
          maxWeight: maxWeight,
          maxAmount: maxAmount,
          sellWeightDiffrence: sellWeightDiffrence
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res3.pfwresponse.result.error || res3.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }

      const res4 = await Api.get('/api/gold/delivery/products');
      if (res4.pfwresponse.status_code === 200) {
        this.setState({
          show_loader: false,
          gold_products: res4.pfwresponse.result.safegold_products
        });
      } else {
        this.setState({
          // show_loader: false,
          error: true,
          errorMessage: res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
            'Something went wrong'
        });
        // toast(res4.pfwresponse.result.error || res4.pfwresponse.result.message ||
        //   'Something went wrong', 'error');
      }
    } catch (err) {
      this.setState({
        show_loader: false,
        error: true,
        errorMessage: 'Something went wrong'
      });
      // toast('Something went wrong', 'error');
    }

    this.setState({
      show_loader: false
    });
  }

  sendEvents(user_action, product_name) {
    let eventObj = {
      "event_name": 'GOLD',
      "properties": {
        "user_action": user_action,
        "screen_name": 'Gold Locker',
        "product_name": product_name
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  selectGoldProduct(index) {
    this.sendEvents('next', this.state.gold_products[index].disc);
    let selectedProduct = this.state.gold_products[index];
    window.localStorage.setItem('goldProduct', JSON.stringify(selectedProduct));
    this.navigate(this.state.provider + '/select-gold-product');
  };


  
  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams
    });
  }


  productImgMap = (product) => {
    const prod_image_map = {
      2: one_gm_front,
      3: two_gm_front,
      1: five_gm_front,
      14: five_gmbar_front,
      8: ten_gm_front,
      12: ten_gmbar_front,
      13: ten_gmbar_front,
      15: twenty_gmbar_front,
      16: point_five_gm
    };

    return (
      <img alt="Gold" className="delivery-icon" src={prod_image_map[product.id]} width="80" />
    );
  }

  renderDeliveryProducts =(props, index)  =>{
    return (
      <div key={index} onClick={() => this.selectGoldProduct(index)} className="delivery-tile">
        {this.productImgMap(props)}

        <div className="disc">{props.description}</div>
        <div className="making-charges">Making charges</div>
        <div className="making-cost">Rs. {props.delivery_minting_cost}</div>
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
      showSteps: !this.state.showSteps
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

        <div className="show-more">
          SHOW MORE
        </div>

        <div className="gold-how-steps" onClick={() => this.showHideSteps()}>
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

        <GoldBottomSecureInfo />
      </div>
      </Container>
    );
  }
}

export default GoldDeliveryProducts;
