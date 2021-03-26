import React, { Fragment, Component } from 'react'
import Container from '../common/Container'
import { nativeCallback } from 'utils/native_callback'
import { getConfig } from 'utils/functions'
import { getUrlParams } from 'utils/validators'
import ContactUs from '../../common/components/contact_us'
import Failed from './failed'
import Complete from './complete'
import toast from '../../common/ui/Toast'
import Api from '../../utils/api'

class DigiStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show_loader: false,
      productName: getConfig().productName,
      params: getUrlParams(),
    }
  }

  handleClick = () => {
    // nativeCallback({ action: 'exit_web' });
    this.props.history.push({
      pathname: '/invest',
      search: getConfig().searchParams,
    })
  }

  retry = async () => {
    const redirectUrl = encodeURIComponent(
      window.location.origin + '/kyc-esign/nsdl' + getConfig().searchParams
    )

    this.setState({ show_loader: 'button' })

    try {
      let res = await Api.get(
        `/api/kyc/formfiller2/kraformfiller/upload_n_esignlink?kyc_platform=app&redirect_url=${redirectUrl}`
      )
      let resultData = res.pfwresponse.result
      if (resultData && !resultData.error) {
        if (getConfig().app === 'ios') {
          nativeCallback({
            action: 'show_top_bar',
            message: {
              title: 'eSign KYC',
            },
          })
        }
        nativeCallback({
          action: 'take_control',
          message: {
            back_text: 'You are almost there, do you really want to go back?',
          },
        })
        window.location.href = resultData.esign_link
      } else {
        toast(
          resultData.error || resultData.message || 'Something went wrong',
          'error'
        )
      }

      this.setState({ show_loader: false })
    } catch (err) {
      this.setState({
        show_loader: false,
      })
      toast('Something went wrong')
    }
  }

  render() {
    const { show_loader, productName } = this.state
    const { status = 'failed' } = this.state.params
    const headerData = {
      icon: 'close',
      goBack: this.handleClick,
    }

    return (
      <Container
        showLoader={show_loader}
        title={
          status === 'success' ? 'eSign KYC completed' : 'eSign KYC failed'
        }
        handleClick={status === 'success' ? this.handleClick : this.retry}
        buttonTitle="OKAY"
        headerData={headerData}
      >
        {/* <div className="nsdl-status">
          <img
            src={require(`assets/${productName}/ils_esign_${status}.svg`)}
            style={{ width: "100%" }}
            alt="Nsdl Status"
          />
          {status === "success" ?
            <div className="nsdl-status-text">
              You have successfully signed your KYC documents.
            </div>
            :
            <div className="nsdl-status-text">
              Sorry! the eSign verification is failed. Please try again.
            </div>
          }
        </div> */}
        {status === 'success' ? (
          <Fragment>
            <Failed />
            <ContactUs />
          </Fragment>
        ) : (
          <Complete />
        )}
        {/* <ContactUs /> */}
      </Container>
    )
  }
}

export default DigiStatus
