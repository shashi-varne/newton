import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import { getConfig } from 'utils/functions';
import { insuranceProductTitleMapper } from '../../constants';
import { nativeCallback } from 'utils/native_callback';

class DeclarationClass extends Component {

  constructor(props) {
    super(props);
    this.state = {
        checked: false,
        parent: this.props.parent,
        show_loader: true,
        premium_details : {},
        productTitle : {}
    };
    
  }


  handleClickback = () => {
    this.navigate('plan')
  }

  handleClick = () => {

  
    var final_data = {
      "product_plan": this.props.parent.props.location.params.premium_details.product_plan,
      "premium": this.props.parent.props.location.params.premium_details.premium,
      "cover_amount": this.props.parent.props.location.params.premium_details.cover_amount,
      "tax_amount": this.props.parent.props.location.params.premium_details.tax_amount,
      "productTitle":this.props.parent.props.location.params.premium_details.productTitle
    } 


    this.navigate('form', '' ,final_data )
  }
 

  componentWillMount() {
    let productTitle = insuranceProductTitleMapper[this.props.parent ? this.props.parent.state.product_key : ''];
 

    this.setState({
    productTitle: productTitle,
  })

  }


  sendEvents(user_action, insurance_type) {
    let eventObj = {
      "event_name": 'Group Insurance',
      "properties": {
        "user_action": user_action,
        "screen_name": 'decleration',
        "type": this.props.parent.state.product_key
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  navigate = (pathname, search, premium_details) => {

    this.props.parent.props.history.push({
      pathname: pathname,
      search: search ? search : getConfig().searchParams,
      params: {
        premium_details: premium_details || {}
      }
    });
  }

  componentDidMount(){
    this.setState({
        show_loader: false
      })
  }



  render() {
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        dualbuttonwithouticon={true}
        fullWidthButton={false}
        product_key={this.props.parent ? this.props.parent.state.product_key : ''}
        onlyButton={false}
        showLoader={this.state.show_loader}
        twoButton={true}
        buttonOneTitle="NO, I CAN'T CONFIRM"
        buttonTwoTitle="YES I CONFIRM"
        classOverRideContainer="payment-success"
        title="Declaration"
        handleClick2={() => this.handleClick()}
        // handleClick={() => this.handleClick()}
        handleClickOne={() => this.handleClickback()}
        handleClickTwo={() => this.handleClick()}
      >
        <div style={{fontWeight : '300'}}  >
      <h4>I declare that I or any other member proposed to be insured under this policy don’t have or had;</h4>
        <p>1. Any respiratory-related symptoms like severe cough, respiratory diseases, breathlessness in the past 4 weeks</p> 
        <p>2. I/We have not traveled to or from the following places since 31 st December 2019</p> 
        <ul  style={{  padding: "15px"}} >
        <li>China</li>
        <li>Japan</li>
        <li>Singapore</li>
        <li>Hong Kong</li>
        <li>South Korea</li>
        <li>Thailand</li>
        <li>Malaysia</li>
        <li>Macau</li>
        <li>Taiwan</li>
        <li>Italy</li>
        <li>Iran</li>
        </ul>
      
        <p>I / We are neither undergoing nor awaiting any treatment medical or surgical nor attending any follow up for any suspected COVID 19 infection or recommended for Quarantine in any medical facility including Government or Military Hospital or Isolation ward.</p>
        <p>I hereby declare and warrant on my behalf and on behalf of all persons proposed to be insured that the above statements are true and complete in all respects. I agree that this declaration shall be the basis of the decision by Bharti AXA General Insurance Co Ltd. to cover or not cover us under insurance.</p>
        </div>
      </Container>
    );
  }
}

const Declaration = (props) => (
  <DeclarationClass
    {...props} />
);

export default Declaration;