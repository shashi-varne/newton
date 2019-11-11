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
        classOverRideContainer="payment-Success"
      >
        <div style={{  }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '20px 10px' }}>
            <img src={thumb} alt="" width="60" style={{ marginRight: '15px' }} />
            <div>
              <div style={{ color: '#160d2e', fontSize: '16px', fontWeight: '700', marginBottom: '10px' }}>Payment successful</div>
              <div style={{ color: '#a2a2a2', fontSize: '14px', lineHeight: '20px' }}>One final step! Share your address and you are insured. </div>
            </div>
          </div>
          <div style={{ height: '2px', background: '#eaeaea', width: '100%' }}></div>
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