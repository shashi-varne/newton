import React, { Component } from "react";
import "./rm_login.scss";
import { getConfig } from "utils/functions";
import Input from "common/ui/Input";
import { onload, startJourney } from "./functions";
import { validateNumber, numberShouldStartWith } from "utils/validators";
import Button from "common/ui/Button";
import { Imgc } from "common/ui/Imgc";

const config = getConfig();
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productName: config.productName,
      form_data: {},
    };
    this.onload = onload.bind(this);
    this.startJourney = startJourney.bind(this);
  }

  componentWillMount() {
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

  handleClick = (event) => {
    var {form_data} = this.state
    console.log(form_data)
    var canSubmitForm = true
    if((this.state.form_data.mobile_no && this.state.form_data.mobile_no.length !== 10) || !validateNumber(form_data.mobile_no) || !numberShouldStartWith(this.state.form_data.mobile_no) ){
        form_data['mobile_no_error'] = 'Enter valid mobile number'
        canSubmitForm = false
    }
    this.setState({form_data})

    if(canSubmitForm){
      this.startJourney();    
    }
  };

  render() {
    let {
      show_loader,
      productName
    } = this.state;
    return (
      <div className="login" data-aid='login'>
        <div className="header">
          <img src={require(`assets/${config.logo}`)} alt="logo" />
        </div>
        <div className="login-details">
          <div className="left-image">
            <Imgc
              src={require(`assets/${productName}/ils_login.svg`)}
              alt="login"
              className="login-left-icon"
            />
          </div>
          <div className="login-form" data-aid='login-form'>
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
                      <Button
                        buttonTitle="START"
                        buttonType="submit"
                        onClick={this.handleClick}
                        showLoader={show_loader}
                        style={{
                          width: "100%",
                          marginTop: "20px",
                          letterSpacing: "2px",
                          minHeight: "45px",
                          borderRadius: `${
                            config?.uiElements?.button?.borderRadius || "2px"
                          }`,
                        }}
                    />
                  </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
