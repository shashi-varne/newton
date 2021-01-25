import React, { Component, Fragment } from 'react'
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {numDifferentiation} from 'utils/validators';
import StatusBar from '../../../common/ui/StatusBar';
import Dialog, {DialogContent} from 'material-ui/Dialog';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


class RecommendationResult extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            openMoreDetailsDialog: false
        }
    }

    handleClose = () =>{
        this.setState({
            openMoreDetailsDialog: false
        })
    }
    
    confirmDialog = () => {
        return (
          <Dialog
            id="bottom-popup"
            open={this.state.openMoreDetailsDialog || false}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            TransitionComponent={Transition}
          >
            <DialogContent>
                <div className="more-details-container">
                    <p className="more-details-heading">Health Insurance coverage</p>

                    <div className="coverage-details">
                        <div className="individual-coverage-detail">
                            <p className="coverage-detail-heading">Target Coverage</p>
                            <p className="coverage-detail-value">{numDifferentiation(10000000)}</p>
                        </div>
                        <div className="individual-coverage-detail">
                            <p className="coverage-detail-heading">Period</p>
                            <p className="coverage-detail-value">1 yr</p>
                        </div>
                        <div className="individual-coverage-detail">
                            <p className="coverage-detail-heading">Premium starts at</p>
                            <p className="coverage-detail-value">₹ 4,000/year</p>

                        </div>
                    </div>
                    <div className="why-recommend">
                        <p className="more-details-sub-heading">Why do we recommend this plan?</p>
                        <p className="more-details-sub-text">Medical expenses are increasing at 7.5% per year. With a well covered health plan, you will be better prepared to handle medical emergencies. Also, buying a separate floater plan for parents is infact cheaper. </p>
                    </div>
                    <div className="more-details-benifits">
                        <p className="more-details-sub-heading">Benifits</p>
                        <div className="more-details-bullets">
                            <p className="diamond-bullet"></p>
                            <p className="diamont-bullet-text">High coverage at affordable premiums</p>
                        </div>
                        <div className="more-details-bullets">
                            <p className="diamond-bullet"></p>
                            <p className="diamont-bullet-text">High coverage at affordable premiums</p>
                        </div>
                        <div className="more-details-bullets">
                            <p className="diamond-bullet"></p>
                            <p className="diamont-bullet-text">High coverage at affordable premiums</p>
                        </div>
                    </div>
                    <div style={{margin: '0 5px', marginTop: '20px'}}>
                        <button  className="call-back-popup-button">GET THE PLAN</button> 
                    </div>

                </div>
            </DialogContent>
          </Dialog>
        );
    }
    openMoreDetailsDialog = () =>{
        this.setState({
            openMoreDetailsDialog: true
        })
    }
    render(){
        return(
            <div className="recommendation-result">
                <StatusBar/>
                <div className="recommendation-info-container">
                    <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Target Coverage</p>
                        <p  className="recommendation-info-value">{numDifferentiation(11000000, true)}</p>
                    </div>
                    <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Period</p>
                        <p  className="recommendation-info-value">30 years</p>
                    </div>
                    <div className="recommendation-info">
                        <p  className="recommendation-info-heading">Premium starts at</p>
                        <p  className="recommendation-info-value">₹ {numDifferentiation(11000000)} </p>
                    </div>

                    <div className="recommendation-cta-container">
                        <div className="more-details" onClick={this.openMoreDetailsDialog}>MORE DETAILS</div>
                        <div className="get-the-plan">GET THE PLAN</div>
                    </div>
                </div>
                {this.confirmDialog()}
            </div>
        )
    }
}

export default RecommendationResult
