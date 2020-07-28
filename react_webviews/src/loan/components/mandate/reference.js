import React, { Component } from 'react';
import Container from '../../common/Container';
import { nativeCallback } from 'utils/native_callback';
import { initialize } from '../../common/functions';
import Input from "common/ui/Input";
import { FormControl } from 'material-ui/Form';
import MobileInputWithoutIcon from '../../../common/ui/MobileInputWithoutIcon';
import Api from 'utils/api';
import toast from '../../../common/ui/Toast';
import {getConfig} from 'utils/functions';

class KycStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show_loader: false,
      form_data: {},
      getLeadBodyKeys: ['personal_info', 'vendor_info'],
      get_lead: true
    }

    this.initialize = initialize.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  onload = () => {
    let lead = this.state.lead;
    let personal_info = lead.personal_info || {};
    let form_data = {
      "ref_name_first": personal_info.ref_name_first || '',
      "ref_contact_first": personal_info.ref_contact_first || '',
      "ref_name_second": personal_info.ref_name_second || '',
      "ref_contact_second": personal_info.ref_contact_second || ''
    };

    this.setState({
        form_data: form_data
    })

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


  getMandateCallback = async () => {

    this.setState({
      show_loader: true
    })
    let body = {
      "request_type": "emandate"
    }

    let resultData = await this.callBackApi(body);
    if (resultData.callback_status) {
       this.navigate('/loan/loan-summary');
    } else {
      let searchParams = getConfig().searchParams + '&status=pending';
      this.navigate('mandate-status', { searchParams: searchParams });
    }
}

submitRef = async() => {
  let keys_to_check = ['ref_name_first', 'ref_contact_first', 
  'ref_name_second', 'ref_contact_second'];

  let form_data = this.state.form_data;
  let canSubmitForm = this.formCheckUpdate(keys_to_check, form_data, true);

  if(canSubmitForm) {
    try {
      this.setState({
        show_loader: true
      })

      let body = {
        "ref_name_first": form_data.ref_name_first,
        "ref_contact_first": form_data.ref_contact_first,
        "ref_name_second": form_data.ref_name_second,
        "ref_contact_second": form_data.ref_contact_second
      };

      const res = await Api.post(`/relay/api/loan/reference/update/${this.state.application_id}`, body);

      let resultData  = res.pfwresponse.result;
      if (res.pfwresponse.status_code === 200 && !resultData.error) {
        this.navigate('/loan/loan-summary');
      } else {
        this.setState({
          show_loader: false
        });

        toast(resultData.error || resultData.message
          || 'Something went wrong');
      }

    } catch (err) {
      this.setState({
        show_loader: false
      });
      toast('Something went wrong');
      console.log(err)
    }
  }

}

  handleClick = async () => {
    this.sendEvents('next');
    this.getMandateCallback();
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
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.ref_name_first_error}
                  helperText={this.state.form_data.ref_name_first_error}
                  type="text"
                  width="40"
                  label="Full name"
                  name="ref_name_first"
                  value={this.state.form_data.ref_name_first || ''}
                  onChange={this.handleChange()} 
                />
              </div>
              <div className="InputField">
                <MobileInputWithoutIcon
                  error={!!this.state.form_data.ref_contact_first_error}
                  helperText={this.state.form_data.ref_contact_first_error} 
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  maxLength={10}
                  name="ref_contact_first"
                  value={this.state.form_data.ref_contact_first || ''}
                  onChange={this.handleChange()} />          
              </div>
            </div>

            <div style={{paddingBottom:'40px'}}>
              <div style={{color: '#64778D',fontSize: 13, margin: '0 0 6px 0'}}>
                2st reference
              </div>
              <div className="InputField">
                <Input
                  error={!!this.state.form_data.ref_name_second_error}
                  helperText={this.state.form_data.ref_name_second_error}
                  type="text"
                  width="40"
                  label="Full name"
                  name="ref_name_second"
                  value={this.state.form_data.ref_name_second || ''}
                  onChange={this.handleChange()}
                />
              </div>
              <div className="InputField">
                <MobileInputWithoutIcon
                  error={!!this.state.form_data.ref_contact_second_error}
                  helperText={this.state.form_data.ref_contact_second_error} 
                  type="number"
                  width="40"
                  label="Mobile number"
                  class="Mobile"
                  maxLength={10}
                  name="ref_contact_second"
                  value={this.state.form_data.ref_contact_second || ''}
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
