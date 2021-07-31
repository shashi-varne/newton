import React from 'react';
import './style.scss';
import Button from '@material-ui/core/Button';
import pointer_icon from 'assets/fisdom/pointer_icon.svg';
import report_icon from 'assets/fisdom/report_icon.svg';
import landing_step_verified from 'assets/fisdom/landing_step_verified.svg';
import amfi_logo from 'assets/amfi_logo.svg';
import bombay_stock_exchange_logo from 'assets/bombay_stock_exchange_logo.svg';
// import pnb_logo from "assets/pnb_logo.svg"
import fisdom_logo from "assets/fisdom/fisdom_white_logo.svg"
import { navigate as navigateFunc} from '../common/commonFunction';
import SVG from 'react-inlinesvg';

const Landing = (props) => {
  const navigate = navigateFunc.bind(props);
  const nextPage = () => {
    navigate("login");
  };
  return (
    <div className='partner-landing-container'>
      <section className='fd-landing-bg-container'>
        <div className='fd-landing-bg-container-sec'>

        <div className="fd-landing-header-img-container">
          {/* <img className="fd-partner-logo" src={pnb_logo} alt="pnb_logo" /> */}
          <img className="fd-fisdom-logo" src={fisdom_logo} alt="pnb_logo" />
        </div>
        {/* <div className="fd-landing-header-text">
        Punjab National Bank partners with fisdom
        </div> */}
        </div>
      </section>

      <section className='fd-landing-content'>
        <div className='fd-landing-heading'>
          If you’ve already made investments via the OBC-mPay app then:
        </div>
        <div className="fd-landing-border-bottom"/>
        <div className='fd-landing-steps-container'>
          <div className='fd-landing-steps'>
            <img className='fd-landing-step-img' src={pointer_icon} alt='s' />
            <div className='fd-landing-step-text'>1. Enter your 10-digit mobile number</div>
          </div>
          <div className='fd-landing-steps'>
            <img className='fd-landing-step-img' src={report_icon} alt='s' />
            <div className='fd-landing-step-text'>
              2. You’ll be redirected to download the fisdom app
            </div>
          </div>
          <div className='fd-landing-steps'>
            <img className='fd-landing-step-img' src={landing_step_verified} alt='s' />
            <div className='fd-landing-step-text'>
              3. Login and enter your PAN to view your existing investments
            </div>
          </div>
        </div>
        <div className='fd-landing-continue'>
        <Button
            className='DialogButtonFullWidth fd-partner-btn'
            onClick={nextPage}
            color='default'
            autoFocus
            >
            Continue to Mobile number
          </Button>
        </div>
      </section>

      <section className='fd-landing-footer-container'>
          <div className='fd-landing-footer-sub-container'>
            <div className="fd-landing-footer-left">
            <div className='fd-landing-footer-sub'>
            <div className='fd-landing-footer-contact-sub'>
              <div className='fd-landing-footer-contact'>Contact us:</div>
              <div className='fd-landing-footer-num'>
                <div>ask@fisdom.com</div> 
                <span className="fd-landing-contact-divider">|</span> 
                <div>+918048093070</div>
                </div>
            </div>
          </div>
            <div className='fd-landing-footer-sub'>
              <SVG
                width="20px"
                height="20px"
                preProcessor={code => code.replace(/fill=".*?"/g, 'fill=#FFF')}
                src={require(`assets/sebi_logo.svg`)}
                alt="sebi"
              />
              <div className='fd-landing-footer-text'>
                SEBI registered investment advisor INA200005323
              </div>
            </div>
            </div>
            <div className="fd-landing-footer-right">

            <div className='fd-landing-footer-sub'>
              <img className='fd-landing-step-img' src={amfi_logo} alt='s' />
              <div className='fd-landing-footer-text'>
                Association of Mutual Funds of India registered mutual fund distributor ARN:103168
              </div>
              
            </div>
            <div className='fd-landing-footer-sub'>
              <img className='fd-landing-step-img' src={bombay_stock_exchange_logo} alt='s' />
              <div className='fd-landing-footer-text'>
                BSE registered mutual fund distributor mutual fund code no:10140
              </div>
            </div>
            </div>
          
        </div>
        <div className='fd-landing-copyright'>Copyright {new Date().getFullYear()} @ Fisdom all rights reserved</div>
      </section>
    </div>
  );
};

export default Landing;
