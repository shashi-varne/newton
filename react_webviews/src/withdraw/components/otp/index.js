import React, { useState, useRef, useEffect } from 'react'
import Container from '../../common/Container'
import OtpDefault from 'common/ui/otp'
import { navigate as navigateFunc } from '../../common/commonFunction'
import toast from 'common/ui/Toast'
import { isEmpty } from '../../../utils/validators'
import { verify, resend } from '../../common/Api'

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
  const navigate = navigateFunc.bind(props)
  const [state, setState] = useState({
    otp: '',
    totalTime: 5,
    timeAvailable: 30,
  })

  const stateParams = props?.location?.state
  console.log(stateParams)

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
        toast(result?.message)
      }
    } catch (err) {
      toast(err.message)
    } finally {
    }
  }

  const verifyOtp = async () => {
    try {
      let result
      if (!isEmpty(stateParams?.verification_link) && !isEmpty(state?.otp)) {
        result = await verify(stateParams?.verification_link, state?.otp)
      }
      navigate('/withdraw/otp/success', {
        type: stateParams?.type,
        message: result?.message,
      }, null, true)
    } catch (err) {
      toast(err.message)
      navigate('/withdraw/otp/failed', {
        type: stateParams?.type,
        message: err.message,
      }, null, true)
    } finally {
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
      hidePageTitle
      buttonTitle="VERIFY"
      disable={state.otp.length !== 4}
      handleClick={verifyOtp}
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
