import React, { Component } from 'react'
import Container from "../../common/Container";
import { getConfig } from "utils/functions";
import toast from "../../../common/ui/Toast";
import { storageService} from '../../../utils/validators';
import Api from "utils/api";

class ResumeIntermeditePage extends Component {

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


    async componentDidMount(){
        this.setState({
            show_loader: true
        })
        
        try{    
            var res = await Api.get(`api/ins_service/api/insurance/fyntune/postpayment/status/check?ref_id=${this.state.fyntune_ref_id}`);
            console.log(res);
            
            this.setState({
                show_loader: false
            })

            if (res.pfwresponse.status_code === 200) {
      
                var resultData = res.pfwresponse.result;
                this.setState({payment_data: resultData})  

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
        
        if(this.state.payment_data.lead.status === "pending"){
            this.navigate(`/group-insurance/life-insurance/savings-plan/landing`);
         }else{
             this.navigate(`/group-insurance/common/report`)
         }
    }
    render() {
        return (
            <Container
            events={this.sendEvents('just_set_events')}
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

export default ResumeIntermeditePage
