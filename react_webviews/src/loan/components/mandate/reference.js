import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Input from "common/ui/Input";
import { FormControl } from 'material-ui/Form';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import {storageService} from 'utils/validators';

class KycStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      application_id: storageService().get('loan_application_id')
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    // ****************************************************
    // code goes here
    // common things can be added inside initialize
    // use/add common functions from/to  ../../common/functions

  }

  sendEvents(user_action) {
    let eventObj = {
      "event_name": 'lending',
      "properties": {
        "user_action": user_action,
        "screen_name": 'introduction'
      }
    };

    if (user_action === 'just_set_events') {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  handleChange = name => event => {
    this.formHandleChange(name, event);
  };

  handleClick = async () => {
    
    this.sendEvents('next');

    let keys_to_check = ['ref_name_first', 'ref_contact_first', 'ref_name_second', 'ref_contact_second'];

    let form_data = this.state.form_data;

    this.formCheckUpdate(keys_to_check, form_data);

    try {
      this.setState({
        show_loader: true
      })

      let body = form_data;

      const res = await Api.post(`/relay/api/loan/reference/update/${this.state.application_id}`, body);

      console.log(res.error)


    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
      console.log(err)
    }
  }

  render() {
    return (
      <Container
        showLoader={this.state.show_loader}
        title="Reference information"
        events={this.sendEvents('just_set_events')}
        buttonTitle="CONTINUE"
        handleClick={() => this.handleClick()}
      >
        <FormControl fullWidth>
          <div className="loan-mandate-reference">
            <div style={{paddingBottom:'40px'}}>
              <div style={{color: '#64778D',fontSize: 13, margin: '0 0 6px 0'}}>
                1st reference
              </div>
              <div style={{marginBottom:'40px'}}>
                <Input
                  error={!!this.state.form_data.ref_name_first_error}
                  helperText={this.state.form_data.ref_name_first_error}
                  type="text"
                  width="40"
                  label="Full name"
                  name="ref_name_first"
                  onChange={this.handleChange()} 
                />
              </div>
              <div style={{marginBottom:'40px'}}>
                <MobileInputWithoutIcon
                  error={!!this.state.form_data.ref_contact_first_error}
                  helperText={this.state.form_data.ref_contact_first_error} 
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  maxLength={10}
                  name="ref_contact_first"
                  onChange={this.handleChange()} />          
              </div>
            </div>

            <div style={{paddingBottom:'40px'}}>
              <div style={{color: '#64778D',fontSize: 13, margin: '0 0 6px 0'}}>
                2st reference
              </div>
              <div style={{marginBottom:'40px'}}>
                <Input
                  error={!!this.state.form_data.ref_name_second_error}
                  helperText={this.state.form_data.ref_name_second_error}
                  type="text"
                  width="40"
                  label="Full name"
                  name="ref_name_second"
                />
              </div>
              <div style={{marginBottom:'40px'}}>
                <MobileInputWithoutIcon
                  error={!!this.state.form_data.ref_contact_second_error}
                  helperText={this.state.form_data.ref_contact_second_error} 
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  maxLength={10}
                  name="ref_contact_second"
                  onChange={this.handleChange()} />          
              </div>
            </div>
          </div>
        </FormControl>
      </Container>
    );
  }
}

export default KycStatus;
