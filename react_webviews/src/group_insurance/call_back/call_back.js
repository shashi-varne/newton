import React, { Component } from 'react';
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import { nativeCallback } from 'utils/native_callback';
import DropdownWithoutIcon from '../../common/ui/SelectWithoutIcon';
import Dialog, {DialogContent} from 'material-ui/Dialog';
import { getConfig } from 'utils/functions';

class CallBackDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            insurance_details: {},
            productName: getConfig().productName,
            form_data: {},
            openConfirmDialog: false
        }
    }

    componentWillMount(){
        var insurance_details = [
            {'name': 'Life Insurance', 'value': 'life'},
            {'name': 'Health Insurance', 'value': 'health'},
            {'name': 'Covid Insurance', 'value': 'covid'},
            {'name': 'Anything else', 'value': 'anything'}
        ]

        this.setState({
            insurance_details: insurance_details
        })
    }

    handleClose = () =>{
        this.setState({
            openConfirmDialog: false
        })
    }
    
    navigate = (pathname) => {
      this.props.history.push({
          pathname: pathname,
          search: getConfig().searchParams
      });
    }

    acknowledgement = () =>{
      this.sendEvents('next','acknowledgment');
      this.navigate('/group-insurance')
    }

    confirmDialog = () => {
        return (
          <Dialog
            id="bottom-popup"
            open={this.state.openConfirmDialog || false}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <div className="group-health-bmi-dialog" id="alert-dialog-description">
    
                <div className="top-content flex-between">
                  <div className="generic-page-title">
                    <h4>Great!</h4>
                  </div>
                  <img className=""
                    src={require(`assets/${this.state.productName}/call_back_confirm.svg`)} alt="" />
                </div>
                <div className="content-mid" style={{marginBottom: '20px'}}>
                    We'll be calling you shortly. Please keep your phone handy so you don't miss our call.
                </div>
                <div style={{margin: '0 5px'}}>
                  <button onClick={()=> this.acknowledgement()} className="call-back-popup-button">GOT IT</button> 
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
    }

    handleChange = name => event => {
        if (!name) {
            return
        }
        
        let form_data = this.state.form_data
        var value = '';

        if(name !== 'insuranceType'){
            value = event ? event.target.value : event;
        }else{
            value = event
            form_data.index = event;
        }

        if (name === 'mobile') {
            console.log('out')
            if (value.length <= 10) {
                console.log('here')
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        } else {
            console.log('else')
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }

        console.log(this.state.form_data)
        this.setState({
            form_data: form_data
        })

    }

    handleClick = () =>{

      this.sendEvents('next','personal_details')
      var form_data = this.state.form_data;
      var canSubmitForm = true;
      

      if (form_data && (form_data.name || '').split(" ").filter(e => e).length < 2) {
        form_data.name_error = 'Enter valid full name';
        canSubmitForm = false;
      }

      if((form_data && form_data.mobile && form_data.mobile.length < 10) || (!form_data.mobile)){
        form_data.mobile_error = 'Enter valid full mobile number';
        canSubmitForm = false;
      }
      if(!form_data.insuranceType){
        form_data.insuranceType_error = 'Select type of insurance';
        canSubmitForm = false;
      }

      this.setState({
        form_data: form_data
      }, ()=>{
        console.log('form', form_data)
      })
      
      if(canSubmitForm){
        this.setState({
          openConfirmDialog: true
        })
      }
        
    }

    sendEvents(user_action, screen_name) {
        let eventObj = {
          "event_name": 'insurance_callback',
          "properties": {
            "user_action":  user_action,
            "screen_name": screen_name ? screen_name : 'personal_details'
          }
        };
      
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({
            events: eventObj
          });
        }
    }

    render() {
        return (
        
        <Container
        events={this.sendEvents('just_set_events')}
        fullWidthButton={true}
        onlyButton={true}
        handleClick={() => this.handleClick()}
        buttonTitle="GIVE ME A CALL"
        title="Let's talk &#38; help you out">
        
        <p style={{marginTop: '-10px', color: '#767E86'}}>Enter your details &#38; we'll call you in 15 mins</p>
        
        <div style={{marginTop: '20px'}}>
        <div className="InputField">
            <Input
              type="text"
              width="40"
              label="Name"
              class="Name"
              id="name"
              name="name"
              error={this.state.form_data.name_error ? true : false}
              helperText={this.state.form_data.name_error}
              value={this.state.form_data.name || ""}
              onChange={this.handleChange("name")}
            />
            </div>
            <div className="InputField">
            <Input
              type="number"
              width="40"
              label="Mobile number"
              class="mobileNumber"
              id="mobileNumber"
              name="mobileNumber"
              error={this.state.form_data.mobile_error ? true : false}
              helperText={this.state.form_data.mobile_error}
              value={this.state.form_data.mobile || ""}
              onChange={this.handleChange("mobile")}
            />
            </div>
            <div className="InputField">
            <DropdownWithoutIcon
              parent={this}
              header_title="What you're interested in"
            //   cta_title="SAVE"
              selectedIndex = {this.state.form_data.index || 0}
              width="40"
              dataType="AOB"
              options={this.state.insurance_details}
              id="insurance"
              label="What you're interested in"
              error={this.state.form_data.insuranceType_error ? true : false}
              helperText={this.state.form_data.insuranceType_error}
              name="insuranceType"
              value={this.state.form_data.insuranceType || ''}
              onChange={this.handleChange("insuranceType")}
            />
            </div>
        </div>
        {this.confirmDialog()}
        </Container>
        )
    }
}

export default CallBackDetails;
