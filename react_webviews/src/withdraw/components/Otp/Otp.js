import React, { useState, useRef, useEffect } from 'react'
import Container from '../../common/Container'
import OtpDefault from 'common/ui/otp'
import { navigate as navigateFunc } from '../../common/commonFunction'
import toast from 'common/ui/Toast'
import { isEmpty } from '../../../utils/validators'
import { verify, resend } from '../../common/Api'
import './Otp.scss';

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
    try {
      setIsApiRunning("button");
      let result;
      if (!isEmpty(stateParams?.verification_link) && !isEmpty(state?.otp)) {
        result = await verify(stateParams?.verification_link, state?.otp)
      }
      navigate('/withdraw/otp/success',
              { state : {
                  type: stateParams?.type,
                  message: result?.message,
                } 
              }, true)
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
        }, true)
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

  return (
    <Container
      data-aid='verify-otp-screen'
      hidePageTitle
      buttonTitle="VERIFY"
      disable={state.otp.length !== 4}
      handleClick={verifyOtp}
      showLoader={isApiRunning}
    >
      <section id="withdraw-verify" className="withdraw-verification" data-aid='withdraw-verification'>
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
