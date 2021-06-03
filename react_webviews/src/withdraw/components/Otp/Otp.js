import React, { useState, useRef, useEffect } from 'react'
import Container from '../../common/Container'
import OtpDefault from 'common/ui/otp'
import { navigate as navigateFunc } from 'utils/functions'
import toast from 'common/ui/Toast'
import { isEmpty } from '../../../utils/validators'
import { verify, resend } from '../../common/Api'
import './Otp.scss';
import { nativeCallback } from '../../../utils/native_callback'

function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      callback()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const Otp = (props) => {
  const navigate = navigateFunc.bind(props);
  const [isApiRunning, setIsApiRunning] = useState(false)
  const [resendClicked, setResendClicked] = useState(false)
  const [state, setState] = useState({
    otp: '',
    totalTime: 30,
    timeAvailable: 30,
  })

  const stateParams = props?.location?.state

  useInterval(() => {
    setState((state) => {
      if (state.timeAvailable > 0) {
        return { ...state, timeAvailable: state.timeAvailable - 1 }
      }
      return state
    })
  }, 1000)

  const resendOtp = async () => {
    setResendClicked(true)
    try {
      if (!isEmpty(stateParams?.resend_redeem_otp_link)) {
        const result = await resend(stateParams?.resend_redeem_otp_link)
        toast(result?.message, 'success')
      }
    } catch (err) {
      toast(err.message, 'error')
    } finally {
    }
  }

  const verifyOtp = async () => {
    sendEvents('next')
    try {
      setIsApiRunning("button");
      let result;
      if (!isEmpty(stateParams?.verification_link) && !isEmpty(state?.otp)) {
        result = await verify(stateParams?.verification_link, state?.otp)
      }
      navigate("/withdraw/otp/success", {
        state: {
          type: stateParams?.type,
          message: result?.message,
        },
      });
      } catch (err) {
        if(err.message.includes('wrong')){
        toast(err.message, 'error')
      } else {
        toast(err.message, 'error')
        navigate('/withdraw/otp/failed', {
          state :{
            type: stateParams?.type,
            message: err.message,
          }
        })
      }
    } finally {
      setIsApiRunning(false)
    }
  }

  const handleOtp = (otp) => {
    setState((state) => {
      return {
        ...state,
        otp,
      }
    })
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      "event_name": "withdraw_flow",
      properties: {
        "user_action": userAction,
        "screen_name": 'withdrawl_otp_screen',
        "resend_clicked": resendClicked ? 'yes' : 'no',
        'flow': stateParams?.type || "",
        'otp': state.otp || ''
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
      hidePageTitle
      buttonTitle="VERIFY"
      disable={state.otp.length !== 4}
      handleClick={verifyOtp}
      showLoader={isApiRunning}
    >
      <section id="withdraw-verify" className="withdraw-verification">
        <div className="header">Enter OTP to verify</div>
        <div className="info">
          OTP has been sent to <strong>{stateParams?.mobile}</strong>, please enter it
          below
        </div>
        <OtpDefault parent={{ state, handleOtp, resendOtp }} class1="center" />
      </section>
    </Container>
  )
}

export default Otp
