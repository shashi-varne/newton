import React, { useState } from 'react'
import Input from 'common/ui/Input'
import Container from '../../common/Container'
import { isEmpty } from '../../../utils/validators'
import { verify, resend } from '../../common/Api'
import toast from 'common/ui/Toast'
import Button from 'common/ui/Button'
import { navigate as navigateFunc } from 'utils/functions'

import './OtpSwitch.scss';
import '../commonStyles.scss';
import { nativeCallback } from '../../../utils/native_callback'
import { getConfig } from '../../../utils/functions'
import WVBottomSheet from '../../../common/ui/BottomSheet/WVBottomSheet'

const config = getConfig();
const OtpSwitch = (props) => {
  const navigate = navigateFunc.bind(props)
  const stateParams = props?.location?.state
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [otp, setOtp] = useState('')
  const [touched, setTouched] = useState(false)
  const [resendClicked, setResendClicked] = useState(false)
  const [errorMessage, setErrorMessage] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  
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

      const _event = {
        event_name: "journey_details",
        properties: {
          journey: {
            name: "withdraw",
            trigger: "cta",
            journey_status: "complete",
            next_journey: "mf",
          },
        },
      };
      // send event
      if (!config.Web) {
        window.callbackWeb.eventCallback(_event);
      } else if (config.isIframe) {
        window.callbackWeb.sendEvent(_event);
      }

      if(!config.isIframe || config.code === "moneycontrol") {
        navigate(
          '/withdraw/otp/success',
          {
            state: {
              type: stateParams?.type,
              message: result?.message,
            }
          }
        )
      }
    } catch (err) {
      toast(err.message)
      if(stateParams.type === "instaredeem") {
        navigate(
          '/withdraw/otp/failed',
          {
            state:{
              type: stateParams?.type,
              message: err.message,
            }
          }
        )
      } else {
        setErrorMessage(err.message || "Something went wrong! Please try again later");
        setOpenPopup(true);
      }
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
      data-aid='otp-switch-verify-screen'
      events={sendEvents("just_set_events")}
      classOverRideContainer="pr-container"
      classOverRide="withdraw-two-button"
      title="OTP"
      type="withProvider"
      noFooter
    >
      <section id="withdraw-otp-switch" className="page otp" data-aid='withdraw-otp-switch'>
        <div className="otp-input" data-aid='otp-input'>
          <div className="otp-text" data-aid='otp-text'>Enter OTP</div>
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
          <div className="resend-otp" data-aid='resend-otp' onClick={resendOtp}>
            Resend OTP
          </div>
          {stateParams.message && <div data-aid='otp-switch-message-text'>{stateParams.message}</div>}
        </div>
        <footer className="page-footer" data-aid='page-footer'>
        <Button
          dataAid='verify-btn'
          disable={disabled}
          onClick={verifyOtp}
          buttonTitle="VERIFY"
          showLoader={isApiRunning}
          style={{
            width: "180px"
          }}
        />
        </footer>
        <WVBottomSheet
          open={openPopup}
          subtitle={errorMessage}
          button1Props={{
            title: "OK",
            variant: "contained",
            onClick: () => setOpenPopup(false)
          }}
        />
      </section>
    </Container>
  )
}

export default OtpSwitch
