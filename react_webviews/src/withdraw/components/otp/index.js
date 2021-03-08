import React, { useState, useRef, useEffect } from 'react'
import Container from '../../common/Container'
import OtpDefault from 'common/ui/otp'
import { navigate as navigateFunc } from '../../common/commonFunction'
import toast from 'common/ui/Toast'
import { isEmpty } from '../../../utils/validators'

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
  const [state, setState] = useState({
    otp: '',
    totalTime: 5,
    timeAvailable: 5,
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
    const navigate = navigateFunc.bind(props)
    try {
      let result
      if (!isEmpty(stateParams?.url)) {
        const result = await resendOtp(stateParams?.url)
      }
    } catch (err) {
      toast(err.message)
    } finally {
    }
  }

  const verifyOtp = async () => {
    const navigate = navigateFunc.bind(props)
    try {
      let result
      if (!isEmpty(stateParams?.url) && !isEmpty(stateParams?.otp)) {
        result = await verifyOtp(stateParams?.url, stateParams?.otp)
      }
      navigate('/withdraw/success', {
        type: stateParams?.type,
        message: result?.message,
      })
    } catch (err) {
      toast(err.message)
      navigate('/withdraw/failed', {
        type: stateParams?.type,
        message: err.message,
      })
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
      hideInPageTitle
      buttonTitle="VERIFY"
      disable={state.otp.length !== 4}
      handleClick={verifyOtp}
    >
      <section id="withdraw-verify" className="withdraw-verification">
        <div className="header">Enter OTP to verify</div>
        <div className="info">
          OTP has been sent to <strong>+91|6261410669</strong>, please enter it
          below
        </div>
        <OtpDefault parent={{ state, handleOtp, resendOtp }} class1="center" />
      </section>
    </Container>
  )
}

export default Otp
