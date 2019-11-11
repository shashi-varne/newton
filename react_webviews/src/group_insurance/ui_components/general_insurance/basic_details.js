import React, { Component } from 'react';
import Container from '../../common/Container';
import Input from '../../../common/ui/Input';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import RadioWithoutIcon from '../../../common/ui/RadioWithoutIcon';
import { genderOptions, insuranceMaritalStatus, relationshipOptions } from '../../constants';
import DropdownWithoutIcon from '../../../common/ui/SelectWithoutIcon';
import Checkbox from 'material-ui/Checkbox';
import Grid from 'material-ui/Grid';

class BasicDetails extends Component {
  state = {
    checked: false
  }

  renderNominee = () => {
    return (
      <div>
        <div className="InputField">
          <Input
            type="text"
            width="40"
            label="Nominee's name"
            class="NomineeName"
            id="nominee-name"
            name="nomineename"
            value='TEST'
            onChange={() => console.log('')} />
        </div>
        <div className="InputField">
          <DropdownWithoutIcon
            width="40"
            options={relationshipOptions}
            id="relationship"
            label="Nominee's relationship"
            value=''
            name="relationship"
            onChange={() => console.log('')} />
        </div>
      </div>
    );
  }

  render() {
    let currentDate = new Date().toISOString().slice(0, 10);

    return (
      <Container
        fullWidthButton={true}
        buttonTitle='Go to Summary'
        onlyButton={true}
        title="BasicDetails">
          <div style={{  }}>
            <div style={{  }}>
              <div style={{ color: '#160d2e', fontSize: '16px', lineHeight: '20px', fontWeight: '500', marginBottom: '10px' }}>Basics Details</div>
              <div style={{ color: '#878787', fontSize: '13px' }}>We only need your basic detail for verification</div>
            </div>
            <div style={{ marginTop: '40px' }}>
              <div className="InputField">
                <Input
                  type="text"
                  width="40"
                  label="Name"
                  class="Name"
                  id="name"
                  name="name"
                  value='TEST'
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  type="text"
                  width="40"
                  label="Date of birth (DD/MM/YYYY)"
                  class="DOB"
                  id="dob"
                  name="dob"
                  max={currentDate}
                  value=''
                  placeholder="DD/MM/YYYY"
                  maxLength="10"
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <Input
                  type="email"
                  width="40"
                  label="E-mail address"
                  class="Email"
                  id="email"
                  name="email"
                  value='j@ck.com'
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <MobileInputWithoutIcon
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  id="number"
                  name="mobile_no"
                  value='9900'
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Gender"
                  class="Gender:"
                  options={genderOptions}
                  id="gender"
                  value=''
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <RadioWithoutIcon
                  width="40"
                  label="Marital Status"
                  class="Marital status:"
                  options={insuranceMaritalStatus}
                  id="marital-status"
                  value=''
                  onChange={() => console.log('')} />
              </div>
              <div className="InputField">
                <div className="CheckBlock2" style={{ padding: '0 15px',margin: '10px 0' }}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={1} className="TextCenter">
                      <Checkbox
                        defaultChecked
                        checked={this.state.checked}
                        color="default"
                        value="checked"
                        name="checked"
                        onChange={() => console.log('Clicked')}
                        className="Checkbox" />
                    </Grid>
                    <Grid item xs={11}>
                      <div style={{ color: '#a2a2a2', fontSize: '14px' }}>Do you want to add nominee details?</div>
                    </Grid>
                  </Grid>
                </div>
              </div>
              { this.state.checked && this.renderNominee()}
            </div>
          </div>
        </Container>
    );
  }
}

export default BasicDetails;