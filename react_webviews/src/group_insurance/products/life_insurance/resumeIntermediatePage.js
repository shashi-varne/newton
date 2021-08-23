import React, { Component } from 'react'
import Container from "../../common/Container";
import { getConfig } from "utils/functions";
import { storageService} from '../../../utils/validators';
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";
import {Imgc} from 'common/ui/Imgc';

class ResumeIntermediatePage extends Component {

    constructor(props){
        super(props);
        this.state={
            skelton: true,
            fyntune_ref_id: storageService().getObject('fyntune_ref_id') || ''
        }
    }

    navigate = (pathname) => {
        this.props.history.push({
          pathname: pathname,
          search: getConfig().searchParams,
        });
      };

    sendEvents(user_action, data = {}) {
        let eventObj = {
          event_name: "life_insurance_savings",
          properties: {
            user_action: user_action,
            screen_name: "resume",
          },
        };

        if (user_action === "just_set_events") {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    setErrorData = (type) => {

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
            'submit': {
              handleClick1: this.handleClick,
              button_text1: 'Retry',
              handleClick2: () => {
                this.setState({
                  showError: false
                })
              },
              button_text2: 'Edit'
            }
          };
      
          this.setState({
            errorData: {...mapper[type], setErrorData : this.setErrorData}
          })
        }
    }

    onload = async () => {
        this.setErrorData("onload");
        let error='';
        let errorType='';
        this.setState({
            skelton: true
        })
        
        try{    
            var res = await Api.get(`api/ins_service/api/insurance/fyntune/postpayment/status/check?ref_id=${this.state.fyntune_ref_id}`);
            console.log(res);
            
            this.setState({
                skelton: false
            })

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                this.setState({
                    payment_data: resultData
                })
            } else {
              error = resultData.error || resultData.message || true;
            }     
        }catch(err){
            console.log(err)
            this.setState({
                skelton: false
            });
            error = true;
            errorType = "crash";
        }
        if (error) {
            this.setState({
                errorData: {
                    ...this.state.errorData,
                    title2: error,
                    type: errorType
                },
                showError: true,
            });
        }
    }
    async componentDidMount(){
        nativeCallback({ action: 'take_control_reset' });
        this.onload();
    }
    handleClick = () =>{
        this.sendEvents('next')
        if(!this.state.payment_data){
            this.navigate(`/group-insurance/life-insurance/savings-plan/landing`);
            return;   
        }else{
            let fyntune_ref_id = this.state.payment_data.lead.fyntune_ref_id;
            if(this.state.payment_data.lead.status === 'success'){
                this.navigate(`/group-insurance/life-insurance/savings-plan/report-details/${fyntune_ref_id}`)
            }else if(this.state.payment_data.lead.status === "pending" && this.state.payment_data.lead.fyntune_status === "Underwriting Approval"){
                this.navigate(`/group-insurance/life-insurance/savings-plan/report-details/${fyntune_ref_id}`)
             }else {
                this.navigate(`/group-insurance/life-insurance/savings-plan/landing`);
             }
        }
    }
    render() {
        return (
            <Container
            showLoader={this.state.show_loader}
            fullWidthButton={true}
            skelton={this.state.skelton}
            showError={this.state.showError}
            errorData={this.state.errorData}
            buttonTitle="OK"
            onlyButton={true}
            handleClick={() => this.handleClick()}
            >
                <div>
                      <h1 className="resume-page-title">Please note!</h1>         
                      <div className="resume-hero-container">
                            <Imgc
                                className="resume-hero-img"
                                src={require(`assets/resume_redirection.png`)}
                                alt=""
                            />
                        </div>
                        <div className="resume-page-content">
                            <p>It seems you may not have completed the application process.</p>
                            <p>You can do so by resuming your application from the ‘Insurance Savings Plan’ page should you see the ‘Resume’ button there.</p>
                        </div>

                </div>
            </Container>
        )
        
    }
}

export default ResumeIntermediatePage;
