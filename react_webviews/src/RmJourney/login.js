import React, { useEffect, useState } from "react";
import "./rm_login.scss";
import { getConfig, navigate as navigateFunc } from "utils/functions";
import { validateNumber, numberShouldStartWith, storageService, validateAlphabets } from "utils/validators";
import Button from "common/ui/Button";
import { Imgc } from "common/ui/Imgc";
import UiSkelton  from "common/ui/Skelton";
import Api from "utils/api";
import Toast from 'common/ui/Toast';
import Input from 'common/ui/Input';

const config = getConfig();
let productName = config.productName;

const RmLogin = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [formData, setformData] = useState({});

  const onload = async () => {
    let error = ''
    setIsApiRunning(true)
    try{
        var url = `api/guest/user/session/create`
        const res = await Api.get(url);
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            storageService().clear();
            //no ui changes required here. It's handled in the backend
            setIsApiRunning(false)
        } else {
          setIsApiRunning(false)
            error = resultData.error || resultData.message || 'Something went wrong. Please try again';
            Toast(error);
        }
    }catch(err){
        setIsApiRunning(false)
        Toast('Something went wrong. Please try again')
    }
  }

  const startJourney = async () =>{
    var error = ''
    setShowLoader('button')
    try{
        var url = `api/guest/user/lead/create?rm_id=${formData.rm_emp_id}&mobile_no=${formData.mobile_no}`
        const res = await Api.get(url);
        var resultData = res.pfwresponse.result;
        if (res.pfwresponse.status_code === 200) {
            var guestLeadId = resultData.insurance_guest_lead.id;
            storageService().set('guestLeadId', guestLeadId);
            navigate('/group-insurance')
        } else {
            setShowLoader(false)
            error = resultData.error || resultData.message || 'Something went wrong. Please try again';
            Toast(error);
        }
    }catch(err){
      setShowLoader(false)
      Toast('Something went wrong. Please try again')
    }
}

  const handleChange = (name) => (event) => {
    const value = event.target ? event.target.value : event;
    var data = {...formData}
    if (name === 'mobile_no') {
      if(validateAlphabets(value)) return;
      if (value.length <= 10) {
          data[name] = value;
          data[name + '_error'] = '';
      }
    }else{
        data[name] = value;
        data[name + '_error'] = '';
    }
    setformData({...data})
  }
  
  const handleClick = (event) => {
    var canSubmitForm = true
    var data = {...formData}

    if((data.mobile_no && data.mobile_no.length !== 10) || 
      !validateNumber(data.mobile_no) || 
      !numberShouldStartWith(data.mobile_no) )
      {
        data['mobile_no_error'] = 'Enter valid mobile number'
        canSubmitForm = false
      }
      setformData({...data})

      if(canSubmitForm){
        startJourney();    
    }
  };

  useEffect(() => {
    onload();
  }, []); 

  return (
    <div>
    {
      isApiRunning ?  <UiSkelton type="g"/> : 
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
                          error={formData.mobile_no_error ? true : false}
                          helperText={formData.mobile_no_error}
                          value={formData.mobile_no || ""}
                          onChange={handleChange('mobile_no')}
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
                          error={formData.rm_emp_id_error ? true : false}
                          helperText={'*This field is required only if policy is sold by BD team'}
                          value={formData.rm_emp_id || ""}
                          onChange={handleChange('rm_emp_id')}
                        />
                    </div>
                    <Button
                      buttonTitle="START"
                      buttonType="submit"
                      onClick={handleClick}
                      showLoader={showLoader}
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
    }
    </div>
  );
};


export default RmLogin;