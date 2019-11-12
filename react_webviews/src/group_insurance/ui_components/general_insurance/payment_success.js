import React, { Component } from 'react';
import Container from '../../common/Container';
import '../../common/Style.css';
import thumb from 'assets/thumb.svg';
import { FormControl } from 'material-ui/Form';
import Input from '../../../common/ui/Input';
import TitleWithIcon from '../../../common/ui/TitleWithIcon';
import contact from 'assets/address_details_icon.svg';

class PaymentSuccess extends Component {
  state = {
    pincode: '',
    addressline: '',
    landmark: '',
    city: '',
    state: ''
  }

  render() {
    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Generate Policy'
        onlyButton={true}
        title="Paymnet Success"
        classOverRideContainer="payment-success"
      >
        <div>
          <div className="payment-success-heading">
            <img className="payment-success-icon" src={thumb} alt="" width="60" />
            <div>
              <div className="payment-success-title">Payment successful</div>
              <div className="payment-success-subtitle">One final step! Share your address and you are insured. </div>
            </div>
          </div>
          <div className="payment-success-divider"></div>
          <div style={{ marginTop: '30px' }}>
            <FormControl fullWidth>
              <TitleWithIcon width="15" icon={contact}
                title={'Address Details'} />
              <div className="InputField">
                <Input
                  type="number"
                  width="40"
                  label="Pincode *"
                  id="pincode"
                  name="pincode"
                  value={this.state.pincode}
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  type="text"
                  id="addressline"
                  label="Address*"
                  name="addressline"
                  placeholder="ex: 16/1 Queens paradise"
                  value={this.state.addressline}
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  type="text"
                  id="landmark"
                  label="Landmark *"
                  name="landmark"
                  value={this.state.landmark}
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  disabled={true}
                  id="city"
                  label="City *"
                  value={this.state.city}
                  name="city"
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  disabled={true}
                  id="state"
                  label="State *"
                  value={this.state.state}
                  name="state"
                  onChange={() => console.log('')} />
              </div>
            </FormControl>
          </div>
        </div>
      </Container>
    );
  }
}

export default PaymentSuccess;