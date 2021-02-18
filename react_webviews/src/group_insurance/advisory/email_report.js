import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import Input from '../../common/ui/Input';
import { nativeCallback } from 'utils/native_callback';
import {validateEmail} from 'utils/validators';
import {storageService} from "utils/validators";
import Api from 'utils/api';


class EmailReport extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            showPrefix: false,
            form_data: {}
        }
    }

    handleChange = name => event => {
        let form_data = this.state.form_data;

        if (!name) {
          name = event.target.name;
        }

        var value = event.target ? event.target.value : event;
        form_data[name] = value;
        form_data[name + '_error'] = ''

        this.setState({
            form_data: form_data
        })
    }

    setErrorData = (type) => {

      this.setState({
        showError: false
      });
      if(type) {
        let mapper = {
          // 'onload':  {
          //   handleClick1: this.getLead,
          //   button_text1: 'Fetch again',
          //   title1: ''
          // },
          'submit': {
            handleClick1: this.handleClick,
            button_text1: 'Retry',
            handleClick2: () => {
              this.setState({
                showError: false
              })
            },
            button_text2: 'Edit'
          }
        };
    
        this.setState({
          errorData: {...mapper[type], setErrorData : this.setErrorData}
        })
      }
  }

    sendEvents(user_action, insurance_type, banner_clicked) {
      let eventObj = {
        "event_name": 'insurance_advisory',
        "properties": {
          "user_action": user_action,
          "insurance_type": insurance_type,
          "screen_name": 'email report',
          'email_entered' : this.state.form_data.email && this.state.form_data.email.length ? 'yes' : 'no',
        }
      };
  
      if (user_action === 'just_set_events') {
        return eventObj;
      } else {
        nativeCallback({ events: eventObj });
      }
    }

    navigate = (pathname, search) => {
        this.props.history.push({
          pathname: pathname,
          search: search ? search : getConfig().searchParams,
        });
    }    

    handleClick = async () =>{
      this.setErrorData('submit');

        var form_data = this.state.form_data;
        var canSubmitForm = true;        
        if(form_data){
            if (!form_data.email || (form_data.email && (form_data.email.length < 10 || !validateEmail(this.state.form_data.email)))) {
                form_data.email_error = 'We need some details to move forward!';
                canSubmitForm = false
            }
        }
        this.setState({form_data: form_data})       
        if(canSubmitForm){

          this.setState({
            show_loader: 'button'
          })

          this.sendEvents('next')
            var advisory_id = storageService().getObject("advisory_id");
          let error = '';
            try{
                var res = await Api.get(`api/insurancev2/api/insurance/advisory/email/trigger?insurance_advisory_id=${advisory_id}&email=${this.state.form_data.email}`);
          
                  this.setState({
                    show_loader: false
                  })
                  var resultData = res.pfwresponse.result;
          
                  if (res.pfwresponse.status_code === 200) {
                    this.navigate('/group-insurance/advisory/recommendations')
                  } else {
                    error = resultData.error || resultData.message || "Something went wrong";
                }
              }catch(err){
                this.setState({
                  show_loader: false,
                  skelton: false,
                  showError: true,
                  errorData: {
                    ...this.state.errorData, type: 'crash'
                  }
                });
              } 
              
            if(error) {
              this.setState({
                errorData: {
                  ...this.state.errorData,
                  title2: error
                },
                showError: true,
                skelton: false,
              })
            }           
        }

    }
    render(){
        return(
            <Container
            events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            // force_hide_inpage_title={true}
            onlyButton={true}
            buttonTitle="SEND"
            showError={this.state.showError}
            errorData={this.state.errorData}
            showLoader={this.state.show_loader}
            skelton={this.state.skelton}
            handleClick={()=>this.handleClick()}
            >
            <div className="email-report-container">
                <p className="email-report-heading">Email report</p>
                <p className="email-report-sub-text">Please provide your email address for us to send the recommendation report PDF file </p>
                
                <div className="InputField">
                    <Input
                        error={(this.state.form_data.email_error) ? true : false}
                        helperText={this.state.form_data.email_error}
                        type="email"
                        width="40"
                        label="Email id"
                        class="Email"
                        id="email"
                        name="email"
                        value={this.state.form_data.email || ''}
                        onChange={this.handleChange()} />
                </div>

            </div>
            </Container>
        )
    }
}

export default EmailReport;
