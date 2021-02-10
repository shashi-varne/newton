import React, { Component } from 'react'
import Container from '../common/Container';
import Api from "utils/api";
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import StepsToFollow from '../../common/ui/stepsToFollow';
import { advisoryConstants } from './constants';
import toast from "../../common/ui/Toast";
import {storageService} from "utils/validators";

class AdvisoryLanding extends Component {

    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            stepsToFollow: advisoryConstants.stepsToFollow
        }
    }

    sendEvents(user_action, insurance_type, banner_clicked) {
        let eventObj = {
          "event_name": 'Group Insurance',
          "properties": {
            "user_action": user_action,
            "screen_name": 'insurance',
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    navigate = (pathname, search) => {
      this.props.history.push({
        pathname: pathname,
        search: search ? search : getConfig().searchParams,
      });
    }

    handleClick = async () =>{
      this.setState({
        show_loader: true
      })

      try{
        var res = await Api.post(`api/insurancev2/api/insurance/advisory/create`);
  
          this.setState({
            show_loader: false
          })
          var resultData = res.pfwresponse.result;
  
          if (res.pfwresponse.status_code === 200) {

            if(resultData.insurance_advisory.status === 'init'){
              storageService().setObject("advisory_id", resultData.insurance_advisory.id);
            this.navigate('/group-insurance/advisory/basic-details')                    
            }
          } else {
            toast(resultData.error || resultData.message || "Something went wrong");
        }
      }catch(err){
        console.log(err)
        this.setState({
          show_loader: false
        });
        toast("Something went wrong");
      }
    }

    render() {
        return(
            <Container
            events={this.sendEvents('just_set_events')}
            fullWidthButton={true}
            // force_hide_inpage_title={true}
            showLoader={this.state.show_loader}
            onlyButton={true}
            title="Let's find the right coverage for you"
            buttonTitle="LET'S GET STARTED"
            handleClick={()=>this.handleClick()}
            >
            <div className="advisory-landing-container">

              <img className="advisory-entry-hero" src={require(`assets/${this.state.type}/advisory_entry_hero.svg`)}/>
              <p className="advisory-hero-desc">We'll recommend insurance coverage options that work for you, based on your profile.</p>
            <p className="" style={{marginBottom: '20px', color: 'black', fontWeight: '600', fontSize: '16px' }}>Find the right coverage in 5 easy steps</p>
              <div className="steps-to-follow-container">
              {
                this.state.stepsToFollow.map( (step, index) =>{
                  return <StepsToFollow key={index + 1} keyId={index + 1} title={step.title} subtitle={step.subtitle} />
                })
              }
              </div>
            </div>

            </Container>
        )
    }
}

export default AdvisoryLanding