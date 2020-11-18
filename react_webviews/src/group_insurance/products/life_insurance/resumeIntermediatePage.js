import React, { Component } from 'react'
import Container from "../../common/Container";
import { getConfig } from "utils/functions";
import toast from "../../../common/ui/Toast";
import { storageService} from '../../../utils/validators';
import Api from "utils/api";
import { nativeCallback } from "utils/native_callback";

class ResumeIntermediatePage extends Component {

    constructor(props){
        super(props);
        this.state={
            show_loader: true,
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

    async componentDidMount(){
        nativeCallback({ action: 'take_control_reset' });
        this.setState({
            show_loader: true
        })
        
        try{    
            var res = await Api.get(`api/ins_service/api/insurance/fyntune/postpayment/status/check?ref_id=${this.state.fyntune_ref_id}`);
            console.log(res);
            
            this.setState({
                show_loader: false
            })

            var resultData = res.pfwresponse.result;
            if (res.pfwresponse.status_code === 200) {
                this.setState({
                    payment_data: resultData
                })
            } else {
                
              toast(resultData.error || resultData.message || "Something went wrong");
            }     
        }catch(err){
            this.setState({
                show_loader: false
            });
            toast("Something went wrong");
        }
         

    }
    handleClick = () =>{
        this.sendEvents('next')
        if(!this.state.payment_data){
            this.navigate(`/group-insurance/life-insurance/savings-plan/landing`);
            return;   
        }else{
            if(this.state.payment_data.lead.status === 'success'){
                this.navigate(`/group-insurance/common/report`)
            }else if(this.state.payment_data.lead.status === "pending" && this.state.payment_data.lead.fyntune_status === "Underwriting Approval"){
                this.navigate(`/group-insurance/common/report`)
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
            buttonTitle="OK"
            onlyButton={true}
            handleClick={() => this.handleClick()}
            >
                <div>
                      <h1 className="resume-page-title">Please note!</h1>         
                      <div className="resume-hero-container">
                            <img
                                className="resume-hero-img"
                                src={require(`assets/resume_redirection.png`)}
                                alt=""
                            />
                        </div>
                        <div className="resume-page-content">
                            <p>You have not completed all the steps of the application process.</p>
                            <p>You can complete the same by resuming your recent activity from 'Insurance Savings Plan' page.</p>
                        </div>

                </div>
            </Container>
        )
        
    }
}

export default ResumeIntermediatePage;
