import React, { Component } from 'react'
import Container from "../../common/Container";
import { getConfig } from "utils/functions";

class ResumeIntermeditePage extends Component {

    navigate = (pathname) => {
        this.props.history.push({
          pathname: pathname,
          search: getConfig().searchParams,
        });
      };


    async componentDidMount(){
        // We get the below data from API call
         var resultData = res.pfwresponse.result;
         this.setState({payment_data: resultData})       

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
            // events={this.sendEvents('just_set_events')}
            // showLoader={this.state.show_loader}s
            // title="Insurance Savings Plan"
            fullWidthButton={true}
            buttonTitle="OK"
            // hide_header={true}
            onlyButton={true}
            handleClick={() => this.handleClick()}
            >
                <div>
                      <h1 className="resume-int-page-title">Please note!</h1>         
                      <div className="resume-int-hero-container">
                            <img
                                className="resume-int-hero-img"
                                src={require(`assets/resume_redirection.png`)}
                                alt=""
                            />
                        </div>
                        <div className="resume-int-page-content">
                            <p>You have not completed all the steps of the application process.</p>
                            <p>You can complete the same by resuming your recent activity from 'Insurance Savings Plan' page.</p>
                        </div>

                </div>
            </Container>
        )
        
    }
}

export default ResumeIntermeditePage
