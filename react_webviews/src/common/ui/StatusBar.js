import React, { Component } from 'react'
import { getConfig } from 'utils/functions';
import { numDifferentiation } from 'utils/validators';
import {advisoryConstants} from '../../group_insurance/advisory/constants';

class StatusBar extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
            recommendation_data: this.props.recommendation_data,
            recommendation_bottom_sheet_data: advisoryConstants.recommendation_bottom_sheet_data
        }
    }
    render(){

        var recommendation_bottom_sheet_data = this.state.recommendation_bottom_sheet_data;
        var recommendation_data = this.state.recommendation_data;
        var key = recommendation_data['key'];

        return(
            <div className="status-bar-container" style={{backgroundColor: '#F6F3FF'}}>
                
                <div className="status-bar-heading-container">
                    <p  className="status-bar-heading">{recommendation_bottom_sheet_data[key]['heading']}</p>
                    <p  className="status-bar-tag">{recommendation_data.tag}</p>
                </div>

                <div className="status-bar">
                    <div className="status-bar-background" style={{backgroundColor: '#D5CBED'}}>
                        <div className="status-bar-progress" style={{backgroundColor: '#4F2DA7', width: `${recommendation_data.coverage_percentage}%`}}></div>
                    </div>
                    
                    <div className="status-bar-numbers">
                        <p className="status-bar-number-left">{numDifferentiation(0, true)}</p>
                        <p className="status-bar-number-right">₹{recommendation_data.target_si}</p>
                    </div>
                </div>

                <div className="status-bar-info-container">
                    <div className="status-bar-info">
                        <p className="status-bar-info-circle" style={{backgroundColor: '#4F2DA7'}}></p>
                        <p className="status-bar-info-text">Current Coverage</p>
                    </div>
                    <div className="status-bar-info">
                        <p className="status-bar-info-circle" style={{backgroundColor: '#D5CBED'}}></p>
                        <p className="status-bar-info-text">Coverage gap -  <span>₹{recommendation_data.coverage_gap}</span> </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default StatusBar;
