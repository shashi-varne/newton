import React, { Component } from 'react'
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import StatusBar from '../../common/ui/StatusBar';
import Dialog, {DialogContent} from 'material-ui/Dialog';
import Slide from '@material-ui/core/Slide';
import {formatAmount } from 'utils/validators'
import {advisoryConstants} from './constants';
import { storageService } from 'utils/validators';
import ReactHtmlParser from 'react-html-parser';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class RecommendationResult extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            openMoreDetailsDialog: false,
            recommendation_data: this.props.recommendation_data,
            recommendation_bottom_sheet_data: advisoryConstants.recommendation_bottom_sheet_data,
            parent: this.props.parent,
            adequate_coverage_present: this.props.recommendation_data.coverage_percentage === 100,
            more_details_cta_text : this.props.recommendation_data.coverage_percentage === 100 ? 'OKAY' : 'GET THE PLAN'
        }
    }
    
    getPlan = (key, screen_name, close_bottom_sheet) =>{
        if(close_bottom_sheet){
            this.handleClose(key);
            return;
        }
        storageService().setObject('from_advisory', true);
        this.sendEvents('next', this.state.recommendation_bottom_sheet_data[key].heading, screen_name);
        this.state.parent.navigate(advisoryConstants.get_plan_path[key])
    }

    sendEvents(user_action, insurance_type, screen_name) {
        let eventObj = {
          "event_name": 'insurance_advisory',
          "properties": {
            "user_action": user_action,
            "insurance_type": insurance_type,
            "screen_name": screen_name,
            "download_report": "no" 
          }
        };
    
        if (user_action === 'just_set_events') {
          return eventObj;
        } else {
          nativeCallback({ events: eventObj });
        }
    }

    handleClose = (key) =>{
        this.sendEvents('back', this.state.recommendation_bottom_sheet_data[key].heading, 'plan details bottom sheet')
        this.setState({
            openMoreDetailsDialog: false
        })
    }

    moreDetailsDialog = () => {
        var recommendation_data = this.state.recommendation_data;
        var recommendation_bottom_sheet_data = this.state.recommendation_bottom_sheet_data;
        var key = recommendation_data['key'];
        var adequate_coverage_present = this.state.adequate_coverage_present
        return (
          <Dialog
            id="bottom-popup"
            open={this.state.openMoreDetailsDialog || false}
            onClose={() => this.handleClose(key)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            TransitionComponent={Transition}
          >
            <DialogContent>
                <div className="more-details-container">
                    <div className="top-content">
                    <p className="more-details-heading">{recommendation_bottom_sheet_data[key]['heading']} coverage</p>

                    <div className={recommendation_data.key !== 'corona' && !adequate_coverage_present ?  "coverage-details" : "coverage-details align-left" }>
                        <div className="individual-coverage-detail">
                            <p className="coverage-detail-heading">Target Coverage</p>
                            <p className="coverage-detail-value">₹{recommendation_data.target_si}</p>
                        </div>
                        { recommendation_data.key !== 'corona' ? (
                        <div className="individual-coverage-detail">
                            <p className="coverage-detail-heading">Period</p>
                            <p className="coverage-detail-value">{recommendation_data.period}</p>
                        </div>
                        ) : null}
                        {
                            !adequate_coverage_present ? (
                        <div className="individual-coverage-detail">
                             <p className="coverage-detail-heading">Premium starts at</p>
                             <p className="coverage-detail-value">₹{formatAmount(recommendation_data.start_premium)}/year</p>
                        </div>   
                            ) : null
                        }
                    </div>
                    <div className="why-recommend">
                        <p className="more-details-sub-heading">Why do we recommend this plan?</p>
                        <p className="more-details-sub-text">
                            {recommendation_bottom_sheet_data[key]['why']} 
                            {recommendation_data.key === 'health' && this.props.parentsPresent ? <span> Also, buying a separate floater plan for parents is infact cheaper.</span> : null}
                            
                        </p>
                    </div>
                    <div className="more-details-benifits">
                        <p className="more-details-sub-heading">Benefits</p>
                        {recommendation_bottom_sheet_data[key]['benefits'].map((item, index)=>(
                            <div className="more-details-bullets">
                            <p className="diamond-bullet"></p>
                            <p className="diamont-bullet-text">{item}</p>
                        </div>
                        ))}
                        
                    </div>
                    </div>
                    <div style={{margin: '0 5px', marginTop: '20px', width: '100%'}}>
                        <button  className="call-back-popup-button" onClick={()=>this.getPlan(recommendation_data.key, 'plan details bottom sheet', adequate_coverage_present )}>{this.state.more_details_cta_text}</button> 
                    </div>
                </div>
         
            </DialogContent>
          </Dialog>
        );
    }
    openMoreDetailsDialog = (key) =>{
        this.sendEvents('more details',this.state.recommendation_bottom_sheet_data[key].heading , 'recommendations' )
        this.setState({
            openMoreDetailsDialog: true
        })
    }
    render(){
        
        var recommendation_data = this.state.recommendation_data;
        var adequate_coverage_present = this.state.adequate_coverage_present
        return(
            <div className="recommendation-result">
                <StatusBar recommendation_data={recommendation_data}/>
                {!adequate_coverage_present  ? (
                    <div className="recommendation-info-container">
                    <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Target Coverage</p>
                        <p  className="recommendation-info-value">₹{recommendation_data.target_si}</p>
                    </div>
                    { recommendation_data.key !== 'corona' ? (
                    <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Period</p>
                        <p  className="recommendation-info-value">{recommendation_data.period}</p>
                    </div>
                    ) : null}
                        <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Premium starts at</p>
                        <p  className="recommendation-info-value">₹{formatAmount(recommendation_data.start_premium)}/year </p>
                    </div>
                    {
                        recommendation_data.key === 'health' && this.props.parentsPresent && !adequate_coverage_present  ? (
                            <p className="advisory-sub-text advisory-variable-text">{ReactHtmlParser(recommendation_data.variable_text)}</p>
                        ) : null
                    }
                    <div className="recommendation-cta-container">
                        <div className="more-details" onClick={()=>this.openMoreDetailsDialog(recommendation_data.key)}>MORE DETAILS</div>
                        <div className="get-the-plan" onClick={()=>this.getPlan(recommendation_data.key, 'recommendations', adequate_coverage_present)}>GET THE PLAN</div>
                    </div>
                    </div>
                ):(
                    <div className="adequate-coverage-container">
                        <div className="top-row">
                            <img src={require(`assets/${this.state.type}/shield.svg`)}/>
                            <p>Congratulations! You are well covered</p>
                        </div>
                        <div style={{margin: '0 5px', marginTop: '20px', width: '100%'}}>
                            <button  className="call-back-popup-button" onClick={()=>this.openMoreDetailsDialog(recommendation_data.key)}>READ MORE DETAILS</button> 
                        </div>
                    </div>
                ) }
                
                {this.moreDetailsDialog()}
            </div>
        )
    }
}

export default RecommendationResult
