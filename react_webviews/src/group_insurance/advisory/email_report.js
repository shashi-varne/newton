import React, { Component } from 'react';
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import Input from '../../common/ui/Input';
// import { nativeCallback } from 'utils/native_callback';
import {validateEmail} from 'utils/validators';
import {storageService} from "utils/validators";
import Api from 'utils/api';
import toast from '../../common/ui/Toast';


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

    navigate = (pathname, search) => {
        this.props.history.push({
          pathname: pathname,
          search: search ? search : getConfig().searchParams,
        });
    }    

    handleClick = async () =>{
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
            var advisory_id = storageService().getObject("advisory_id");

            try{
                var res = await Api.get(`api/insurance/advisory/email/trigger?insurance_advisory_id=${advisory_id}&email=${this.state.form_data.email}`);
          
                  this.setState({
                    show_loader: false
                  })
                  var resultData = res.pfwresponse.result;
          
                  if (res.pfwresponse.status_code === 200) {
        
                    if(resultData.insurance_advisory.status === 'init'){
                      storageService().setObject("advisory_id", resultData.insurance_advisory.id);
                    this.navigate('/group-insurance/advisory/basic-details')                    
                    }
                  } else {
                    toast(resultData.error || resultData.message || "Something went wrong");
                }
              }catch(err){
                console.log(err)
                this.setState({
                  show_loader: false
                });
                toast("Something went wrong");
              }            

            this.navigate('/group-insurance/advisory/recommendations')
        }

    }
    render(){
        return(
            <Container
            // events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            // force_hide_inpage_title={true}
            onlyButton={true}
            buttonTitle="SEND"
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
