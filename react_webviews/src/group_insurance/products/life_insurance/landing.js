import React, { Component } from "react";
import Container from "../../common/Container";

import Api from "utils/api";
import toast from "../../../common/ui/Toast";
import { getConfig } from "utils/functions";
import { nativeCallback } from "utils/native_callback";
import HowToSteps from "../../../common/ui/HowToSteps";
import {fyntuneConstants} from './constants';
import StepsToFollow from '../../../common/ui/stepsToFollow';
import {   inrFormatDecimal, numDifferentiationInr, storageService} from '../../../utils/validators';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import {open_browser_web} from  'utils/validators';

class FyntuneLanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skelton: true,
      productName: getConfig().productName,
      stepsContentMapper: fyntuneConstants.stepsContentMapper,
      stepsToFollow: fyntuneConstants.stepsToFollow,
      faq_data: fyntuneConstants.faq_data,
      logo_cta: fyntuneConstants.logo_cta,
      openDialogRefresh: false
    };
  }

  navigate = (pathname) => {
    this.props.history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    });
  };

  setErrorData = (type, cb) => {
    this.setState({
      showError: false
    });
    if(type) {
      let mapper = {
        'onload':  {
          handleClick1: this.onload,
          button_text1: 'Retry',
          title1: ''
        },
        'onload_provider_error':  {
          handleClick1: this.handleProviderError,
          button_text1: 'Okay',
          title1: ''
        },
        'submit': {
          handleClick1: this.handleClick,
          button_text1: 'Retry',
          handleClick2: () => {
            this.setState({
              showError: false,
              skelton: false,
            })
          },
          button_text2: 'CLOSE'
        }
      };
      this.setState({
        errorData: {...mapper[type], setErrorData : this.setErrorData}
      }, () => {
        if(typeof cb === 'function') {
          return cb();
        }
        
      })
    }
  }

  onload = async() => {

    this.setErrorData('onload');
    let error = ''
    let errorType = '';
    nativeCallback({ action: 'take_control_reset' });
    this.setState({
      skelton: true,
      openDialogRefresh: false,
      providerError: ''
    })
    //resume api
    try{
      var res = await Api.get(`api/ins_service/api/insurance/fyntune/get/resumelist`);
      var resultData = res.pfwresponse.result;

      if (res.pfwresponse.status_code === 200) {
      
      if(resultData.resume_present){
        let fyntuneRefId = resultData.lead.fyntune_ref_id;
        storageService().setObject('fyntune_ref_id', fyntuneRefId);
      }
      this.setState({
        skelton: false
      })
      this.setState({ resume_data : resultData});
        
      } else {
        this.setState({
          skelton: false
        })

        let providerErrors = ["Network error",
        "Network error call status not in 200",
        "Error in ref id creation"];
        error = res.pfwresponse.result.error || res.pfwresponse.result.message || true;

        if(providerErrors.indexOf(error) !== -1) {
          error = '';
          this.setErrorData('onload_provider_error');
          this.setState({
            providerError: 'Seems there is some issue, please try again after sometime'
          })
        }
      }
    } catch (err) {
      this.setState({
        skelton: false,
      });
      error=true;
      errorType= "crash";
    }

    // set error data
    if(error) {
      this.setState({
        errorData: {
          ...this.state.errorData,
          title2: error,
          type: errorType
        },
        showError: 'page'
      })
    }
  }

  async componentDidMount(){
    this.onload();
  }

  

  sendEvents(user_action, data = {}) {
    let eventObj = {
      event_name: "life_insurance_savings",
      properties: {
        user_action: user_action,
        // product: fyntuneConstants.provider_api,
        screen_name: "introduction",
      },
    };
    
    if(data.faq){
      eventObj.properties['faq'] = 'yes';
    }
    if(data.resume_clicked){
      eventObj.properties['resume_click'] = 'yes';
    }

    if (user_action === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }

  renderOfferImages = (props, index) => {
    return (
      <div key={index} className="gold-offer-slider">
        <img
          className="offer-slide-img"
          src={require(`assets/${props.src}`)}
          alt="Gold Offer"
        />
      </div>
    );
  };

  handleDialogOk = () => {
    this.onload();
  }

  handleProviderError = () => {
    this.setState({
      showError: false
    })
  }

  renderDialog = () => {
    return (
        <Dialog
            fullScreen={false}
            open={this.state.openDialogRefresh}
            onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogContent>
                <DialogContentText>
                  Once you complete all the steps on HDFC portal, please click 'OK' to proceed further.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleDialogOk} color="default" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
  }
  handleResume = () => {
    if (!this.state.resume_data.resume_present) {
      return;
    }

    this.sendEvents("next", {resume_clicked: "yes"});
    var resume_redirection_url = this.state.resume_data.redirection_url;
    var redirectToHDFC = this.state.resume_data.chrome_tab_enable;

    let intermediateScreenURL = encodeURIComponent(
      window.location.origin + `/group-insurance/life-insurance/resume-intermediate` + getConfig().searchParams
    );
    let landingScreenURL = window.location.origin + `/group-insurance/life-insurance/savings-plan/landing` + getConfig().searchParams;
    
    var journeyURL = resume_redirection_url + '?back_url_webview='+  intermediateScreenURL + '&resume_url_webview='+ landingScreenURL;

    if(getConfig().Web){
      open_browser_web(journeyURL, '_blank')
      this.setState({
        openDialogRefresh: true
      });

    }else{
      if(redirectToHDFC){

        nativeCallback({
          action: 'open_inapp_tab',
          message: {
              url: resume_redirection_url  || '',
              back_url: intermediateScreenURL || ''
          }
        });
  
      }else{
        if (getConfig().app === 'ios') {
          nativeCallback({
              action: 'show_top_bar', message: {
                  title: 'Insurance Savings Plan' 
              }
          });
      }
        nativeCallback({
        action: 'take_control', message: {
            back_url: landingScreenURL,
            back_text: 'You will be redirected to the starting point, are you sure you want to continue?'
          }
        });
        window.location.href = journeyURL;
      }
    }
    
  };


  openFaqs = () => {

    this.setState({ faq_clicked: true}, ()=>{
      this.sendEvents("next");
    })
    this.sendEvents("next", { faq: "yes" });
    let renderData = this.state.faq_data;

    this.props.history.push({
      pathname: "/gold/common/render-faqs",
      search: getConfig().searchParams,
      params: {
        renderData: renderData,
      },
    });
    
  };

  handleClick = async () => {
    this.sendEvents("next");

    if(this.state.providerError) {
      this.setErrorData('onload_provider_error',() => {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: this.state.providerError
          },
          showError: true
        })
      });
      

      return;
    }
    this.setErrorData('submit');
    let error = '';
    let errorType = '';
    var body = {}
    
    let landingScreenURL = window.location.origin + `/group-insurance/life-insurance/savings-plan/landing` + getConfig().searchParams;
    
    let intermediateScreenURL = encodeURIComponent(
      window.location.origin + `/group-insurance/life-insurance/resume-intermediate` + getConfig().searchParams
    );
    
    
    this.setState({
      show_loader:"button"
      // show_loader: true
    })
    //create lead api
    try{
      var res = await Api.post(`api/ins_service/api/insurance/fyntune/lead/create`, body);

        if (res.pfwresponse.status_code === 200) {
          var resultData = res.pfwresponse.result;

          if(resultData.message && resultData.resume_present){
            
            toast(resultData.message)
            this.setState({
              show_loader: false
            })
            
            return;
          }

          var lead_redirection_url = resultData.redirection_url;
          var fyntuneRefId = resultData.lead.fyntune_ref_id;
          var journeyURL = lead_redirection_url + '?back_url_webview='+  intermediateScreenURL + '&resume_url_webview='+ landingScreenURL;
          
          storageService().setObject('fyntune_ref_id', fyntuneRefId);
          
          if(getConfig().Web) {
            open_browser_web(journeyURL, '_blank')
            this.setState({
              show_loader:false,
              openDialogRefresh: true
            });
          } else {
            if (getConfig().app === 'ios') {
              nativeCallback({
                  action: 'show_top_bar', message: {
                      title: 'Insurance Savings Plan' 
                  }
              });
            }
            nativeCallback({
            action: 'take_control', message: {
                back_url: landingScreenURL,
                back_text: 'You will be redirected to the starting point, are you sure you want to continue?'
              }
            });

            window.location.href = journeyURL;
          }
            
        } else {
          error = res.pfwresponse.result.message || res.pfwresponse.result.message || true
            // toast(resultData.error || resultData.message || "Something went wrong");
        }
      }catch (err) {
        this.setState({
          show_loader: false,
          showError: true
        });
        error = true;
        errorType = "crash";
      }
  
      // set error data
      if(error) {
        this.setState({
          errorData: {
            ...this.state.errorData,
            title2: error,
            type: errorType
          },
          show_loader: false,
          showError: true
        })
      }

};


  render() {
    
    return (
      <Container
        events={this.sendEvents('just_set_events')}
        showError={this.state.showError}
        skelton={this.state.skelton}
        errorData={this.state.errorData}
        showLoader={this.state.show_loader}
        title="Insurance Savings Plan"
        fullWidthButton={true}
        buttonTitle={this.state.resume_data && this.state.resume_data.resume_present ?  "GET A NEW QUOTE": "GET INSURED"}
        onlyButton={true}
        handleClick={() => this.handleClick()}
      >
      <div className="fyntune-landing">
        <div className="landing-hero-container">
            <img
                className="landing-hero-img"
                src={require(`assets/${this.state.productName}/fyntune_landing_page_hero.svg`)}
                alt=""
              />
        </div>

        
          { this.state.resume_data && this.state.resume_data.resume_present && (
            <div className="resume-card" onClick={() => this.handleResume()}>
              <div className="rc-title">Recent activity</div>

              <div className="rc-tile" style={{ marginBottom: 0 }}>
                <div className="rc-tile-left">
                  <div className="">
                    <img
                      src={require(`assets/${this.state.logo_cta}`)}
                      alt=""
                    />
                  </div>
                  <div className="rc-tile-premium-data">
                    <div className="rct-title">
                      {this.state.resume_data.lead.base_plan_title}
                    </div>
                    <div className="rct-subtitle" style={{fontSize: '20px'}}>
                      {inrFormatDecimal(this.state.resume_data.lead.base_premium)}/<span style={{fontSize: '16px', fontWeight: '300'}}>year</span>
                    </div>
                  </div>
                </div>

                <div className="generic-page-button-small">RESUME</div>
              </div>

              <div className="rc-bottom flex-between">
                <div className="rcb-content" style={{fontSize: '14px'}}>
                  Sum assured:{" "}
                  {numDifferentiationInr(this.state.resume_data.lead.sum_assured)}
                </div>
                <div className="rcb-content" style={{fontSize: '14px'}}>
                  Policy term: {this.state.resume_data.lead.tenure} years
                </div>
              </div>
            </div>
          )}
        <div>
          <p className="fyntune-heading">What is Insurance Savings Plan?</p>
          <p className="fyntune-info" style={{textAlign: 'justify'}}>
            This is a plan for your investment cum insurance needs. Sanchay Plus from HDFC Life is one such product which provides you with a chance to create wealth and even gives financial security to your loved ones in case of any unforseen event.
          </p>
        </div>

        <p className="fyntune-heading">Major benefits</p>
        <div className="his" >
          <div className="horizontal-images-scroll">
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn1.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn2.png`)}
              alt=""
            />
            <img
              className="image"
              src={require(`assets/${this.state.productName}/ic_why_fyn3.png`)}
              alt=""
            />
          </div>
        </div>

         <p className="fyntune-heading">Get your plan in 5 easy steps</p>
         {
           this.state.stepsToFollow.map( (step, index) =>{
             return <StepsToFollow key={index + 1} keyId={index + 1} title={step.title} subtitle={step.subtitle} />
           })
         }
         

        <div style={{ transform: "translateY(-50px)", marginBottom: "0px" }}>
          <p className="fyntune-heading" style={{ transform: "translateY(40px)" }}>
            We make this process easy with
          </p>
          <HowToSteps
            style={{ marginTop: 20, marginBottom: 0 }}
            baseData={this.state.stepsContentMapper}
          />
        </div>

        <div className="faq-section" style={{ transform: "translateY(-50px)" }}>
          <div className="generic-hr" style={{marginBottom: "12px" }}></div>
          <div className="flex-center fyntune-faq" onClick={() => this.openFaqs()}>
            <div>
              <img
                className="accident-plan-read-icon"
                src={require(`assets/${this.state.productName}/ic_document_copy.svg`)}
                alt=""
              />
            </div>
            <div style={{fontSize: '17px'}}>Frequently asked questions</div>
          </div>
          <div className="generic-hr" style={{ marginTop: "12px" }}></div>
        </div>
      </div>
      {this.renderDialog()}
      </Container>
    );
  }
}

export default FyntuneLanding;
