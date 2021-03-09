import React, { Component } from 'react';
import Container from '../common/Container';
import Input from '../../common/ui/Input';
import { nativeCallback } from 'utils/native_callback';
import Autochange from '../../common/ui/Autochange'
import Dialog, {DialogContent} from 'material-ui/Dialog';
import MobileInputWithoutIcon from '../../common/ui/MobileInputWithoutIcon';
import { numberShouldStartWith, validateNumber, containsSpecialCharactersAndNumbers} from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import toast from '../../common/ui/Toast';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class CallBackDetails extends Component {

    constructor(props){
        super(props);
        this.state={
            insurance_details: {},
            productName: getConfig().productName,
            form_data: {},
            openConfirmDialog: false,
            showPrefix: false,
            show_loader: false,

        }
    }

    componentWillMount(){
        var insurance_details = [
            {'name': 'Life Insurance', 'value': 'Life Insurance'},
            {'name': 'Health Insurance', 'value': 'Health Insurance'},
            {'name': 'Covid Insurance', 'value': 'Covid Insurance'},
            {'name': 'Anything else', 'value': 'Anything else'}
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
            TransitionComponent={Transition}
          >
            <DialogContent>
              <div className="group-health-bmi-dialog" id="alert-dialog-description">
    
                <div className="top-content flex-between" style={{marginBottom: '20px'}}>
                  <div className="generic-page-title">
                    <p className="call-back-popup-heading">Great!</p>
                  </div>
                  <img className=""
                    src={require(`assets/${this.state.productName}/call_back_confirm.png`)} alt="" />
                </div>
                <div className="content-mid" style={{margin: '0 10px 20px 10px'}}>
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
        if(containsSpecialCharactersAndNumbers(value) && name === 'name'){
          return;
        }
        
        if (name === 'mobile') {
            if (value.length <= 10) {
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        } else {
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }

        this.setState({
            form_data: form_data
        })

    }

    handleClick = async () =>{

      this.sendEvents('next','personal_details')
      var form_data = this.state.form_data;
      var canSubmitForm = true;

      if((form_data && form_data.mobile && form_data.mobile.length < 10) || (!form_data.mobile) || !validateNumber(this.state.form_data.mobile) ||
      !numberShouldStartWith(this.state.form_data.mobile)){
        form_data.mobile_error = 'Enter valid mobile number';
        canSubmitForm = false;
      }

      if((form_data && form_data.name && form_data.name.length < 3) || (!form_data.name)){
        form_data.name_error = "Enter valid name";
        canSubmitForm = false;
      }

      if(!form_data.insuranceType){
        form_data.insuranceType_error = 'Select type of insurance';
        canSubmitForm = false;
      }

      this.setState({
        form_data: form_data
      })
      
      if(canSubmitForm){
        this.setState({
          show_loader: true
        })
        var body = {
          "interest": this.state.form_data.insuranceType,
          "mobile_no": this.state.form_data.mobile,
          "name": this.state.form_data.name
        } 

        try{
          let res = await Api.post('api/insurancev2/api/insurance/create/advisor/callback', body);
            if (res.pfwresponse.status_code === 200) {
              if(res.pfwresponse.result.message === 'success'){
                this.setState({
                  show_loader: false,
                  openConfirmDialog: true
                })
              }
          } else {
            toast(res.pfwresponse.result.error || res.pfwresponse.result.message || 'Something went wrong');
            this.setState({
              show_loader: false
            });
          }
        }catch(err){
          this.setState({
            show_loader: false
          });
          toast('Something went wrong');
        }
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

    addMobilePrefix = () =>{
      this.setState({
        showPrefix: true
      })
    }
    removeMobilePrefix = () =>{
      var form_data = this.state.form_data;

      if(form_data){
        if(form_data.mobile && form_data.mobile.includes('e')){
        }
      }
      if(form_data && form_data.mobile && form_data.mobile.length !== 0){
        return
      }else{
        this.setState({
          showPrefix: false
        })
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
        showLoader={this.state.show_loader}
        title="Let's talk &#38; help you out">
        
        <p style={{marginTop: '-10px', color: '#767E86'}}>Enter your details &#38; we'll call you in 15 minutes</p>
        
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
            <div className="InputField" style={{position: 'relative'}}>
            {this.state.showPrefix && <span className="mobile-number-prefix">+91-</span> }
            <MobileInputWithoutIcon
              error={this.state.form_data.mobile_error ? true : false}
              helperText={this.state.form_data.mobile_error}
              type="number"
              width="40"
              label="Mobile number"
              class="mobile"
              maxLength="10"
              onFocus={()=>this.addMobilePrefix()}
              onBlur={()=>this.removeMobilePrefix()}
              id="call-back-mobile-number"
              name="phone_number"
              value={this.state.form_data.mobile || ""}
              onChange={this.handleChange('mobile')} 
            />
            </div>
            <div className="InputField">
            <Autochange
              parent={this}
              header_title="What you're interested in"
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
