import React, { Component } from 'react'
import Input from 'common/ui/Input';
import Button from 'common/ui/Button';
import { validateNumber, numberShouldStartWith, storageService } from 'utils/validators';
import { getConfig } from 'utils/functions';
import Api from 'utils/api';
import './rm_login.scss';
import Container from 'group_insurance/common/Container.js';
class RMJourney extends Component {
    constructor(props){
        super(props);
        this.state = {
            form_data: {},
            skelton: true,
            show_loader: false,
        }
    }

    setErrorData = (type, dismiss, HandleClickFunc)=> {
        this.setState({
          showError: false,
        });
        if (type) {
          let mapper = {
            onload: {
              handleClick1: this.onload,
              button_text1: "Retry",
              title1: "",
            },
            submit: {
              handleClick1: this.handleClick,
              button_text1: "Retry",
              handleClick2: () => {  
                this.setState({
                  showError: false,
                });
              },
              button_text2: dismiss ? "Dismiss" : "Edit",
            },
          };
      
          this.setState({
            errorData: { ...mapper[type], setErrorData: this.setErrorData },
          });
        }
      }

    onload = async () =>{
        this.setState({
            skelton: true,
        })
        var error = ''
        let errorType = ''
        this.setErrorData('onload')
        try{
            var url = `api/guest/user/session/create`
            const res = await Api.get(url);
            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
    
                this.setState({skelton: false})
                console.log(res)
            } else {
                error = resultData.error || resultData.message || true;
            }
        }catch(err){
            this.setState({
              show_loader: false,
              showError: true,
              skelton: false
            });
            errorType = 'crash';
            error = true;
        }
        if(error) {
            this.setState({
              errorData: {
                ...this.state.errorData,
                title2: error,
                type: errorType
              },
              showError: 'page',
              skelton: false
            })
        }
        
    }  
    async componentWillMount(){
        this.onload();
    }
    handleChange = name => event => {
        let form_data = this.state.form_data;

        if (!name) {
          name = event.target.name;
        }
    
        var value = event.target ? event.target.value : event;
        
        if (name === 'mobile_no') {
            if (value.length <= 10) {
                form_data[name] = value;
                form_data[name + '_error'] = '';
            }
        }else{
            form_data[name] = value;
            form_data[name + '_error'] = '';
        }
        
        this.setState({form_data});
    }

    navigate = (pathname) => {
        this.props.history.push({
            pathname: pathname,
            search: getConfig().searchParams
        });
    }

    handleClick = async () =>{
        var {form_data} = this.state
        console.log(form_data)
        var canSubmitForm = true

        if((this.state.form_data.mobile_no && this.state.form_data.mobile_no.length !== 10) || !validateNumber(form_data.mobile_no) || !numberShouldStartWith(this.state.form_data.mobile_no) ){
            form_data['mobile_no_error'] = 'Enter valid mobile number'
            canSubmitForm = false
        }
        //validate rm emp id
        this.setState({form_data})

        if(canSubmitForm){
            var error = ''
            var errorType = ''
            this.setErrorData('submit')
            this.setState({
                show_loader: 'button'
            })
            try{
                var url = `api/guest/user/lead/create?rm_id=${this.state.form_data.rm_emp_id}&mobile_no=${this.state.form_data.mobile_no}`
                const res = await Api.get(url);
                var resultData = res.pfwresponse.result;
                if (res.pfwresponse.status_code === 200) {
                    console.log(resultData)
                    var guestLeadId = resultData.insurance_guest_lead.id;
                    storageService().setObject('guestLeadId', guestLeadId);
                    this.navigate('/group-insurance')
                } else {
                    error = resultData.error || resultData.message || true;
                }
            }catch(err){
                this.setState({
                  show_loader: false,
                  showError: true,
                });
                errorType = 'crash';
                error = true;
            }
            if(error) {
                this.setState({
                  errorData: {
                    ...this.state.errorData,
                    title2: error,
                    type: errorType
                  },
                  showError: 'page',
                })
            }
    
        }

    }
    render() {
        return (
            <Container
                showLoader={this.state.show_loader}
                skelton={this.state.skelton}
                // showError={this.state.showError}
                // errorData={this.state.errorData}
                fullWidthButton={true}
                buttonTitle="START"
                onlyButton={true}
                noHeader
                handleClick={() => this.handleClick()}
            >
            <div className="rm-login-container">
                <div className="InputField">
                    <Input
                      type="text"
                      width="40"
                      label="Enter customer mobile number"
                      class="mobile_no"
                      id="mobile_no"
                      name="mobile_no"
                      error={this.state.form_data.mobile_no_error ? true : false}
                      helperText={this.state.form_data.mobile_no_error}
                      value={this.state.form_data.mobile_no || ""}
                      onChange={this.handleChange()}
                    />
                </div>

                <div className="InputField">
                    <Input
                      type="text"
                      width="40"
                      label="Enter RM emp ID"
                      class="rm_emp_id"
                      id="rm_emp_id"
                      name="rm_emp_id"
                      error={this.state.form_data.rm_emp_id_error ? true : false}
                      helperText={'*This field is required only if policy is sold by BD team'}
                      value={this.state.form_data.rm_emp_id || ""}
                      onChange={this.handleChange()}
                    />
                </div>
            </div>
            </Container>
        )
    }
}

export default RMJourney;
