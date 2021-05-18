import React, { useState } from 'react'
import Input from 'common/ui/Input'
import Container from '../../common/Container'
import { isEmpty } from '../../../utils/validators'
import { verify, resend } from '../../common/Api'
import toast from 'common/ui/Toast'
import { navigate as navigateFunc } from '../../common/commonFunction'
import Button from 'common/ui/Button'

import './OtpSwitch.scss';
import '../commonStyles.scss';
import { nativeCallback } from '../../../utils/native_callback'

const OtpSwitch = (props) => {
  const navigate = navigateFunc.bind(props)
  const stateParams = props?.location?.state
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [otp, setOtp] = useState('')
  const [touched, setTouched] = useState(false)
  const [resendClicked, setResendClicked] = useState(false)
  
  const handleChange = (event) => {
    if (!touched) {
      setTouched(true)
    }
    const value = event.target?.value || "";
    if(value.length > 4) {
      return;
    }
    setOtp(value)
  }

  const getHelperText = () => {
    if (touched && otp.length === 0) {
      return 'This is required'
    }

    if (touched && otp.length < 4) {
      return 'Minlength is 4'
    }
    
    return ''
  }

  const disabled = otp.length !== 4

  const resendOtp = async () => {
    setResendClicked(true)
    try {
      if (!isEmpty(stateParams?.resend_redeem_otp_link)) {
        setIsApiRunning("button")
        const result = await resend(stateParams?.resend_redeem_otp_link)
        toast(result?.message)
      }
    } catch (err) {
      toast(err.message)
    } finally {
      setIsApiRunning(false)
    }
  }

  const verifyOtp = async () => {
    sendEvents('next')
    setIsApiRunning("button")
    try {
      let result
      if (!isEmpty(stateParams?.verification_link) && !isEmpty(otp)) {
        result = await verify(stateParams?.verification_link, otp)
      }
      navigate(
        '/withdraw/otp/success',
        {
          state: {
            type: stateParams?.type,
            message: result?.message,
          }
        },
        true
      )
    } catch (err) {
      toast(err.message)
      navigate(
        '/withdraw/otp/failed',
        {
          state:{
            type: stateParams?.type,
            message: err.message,
          }
        },
        true
      )
    } finally {
      setIsApiRunning(false)
    }
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": 'withdrawl_otp_screen',
        "resend_clicked": resendClicked ? 'yes' : 'no',
        'flow': 'switch',
        'otp': otp || ''
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      hideInPageTitle
      type="withProvider"
      noFooter
    >
      <section id="withdraw-otp-switch" className="page otp">
        <div className="otp-input">
          <div className="otp-text">Enter OTP</div>
          <Input
            error={touched && otp.length !== 4 ? true : false}
            type="number"
            value={otp}
            helperText={getHelperText()}
            class="input"
            onChange={handleChange}
            required
            minLength={4}
            maxLength={4}
          />
          <div className="resend-otp" onClick={resendOtp}>
            Resend OTP
          </div>
          {stateParams.message && <div>{stateParams.message}</div>}
        </div>
        <footer className="page-footer">
        <Button
          disable={disabled}
          onClick={verifyOtp}
          buttonTitle="VERIFY"
          showLoader={isApiRunning}
          style={{
            width: "180px"
          }}
        />
        </footer>
        
      </section>
    </Container>
  )
}

export default OtpSwitch
