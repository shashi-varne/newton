import React, { Component, Fragment } from 'react'
import { getConfig } from 'utils/functions';
// import { nativeCallback } from 'utils/native_callback';
import { numDifferentiation } from 'utils/validators';


class StatusBar extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
        }
    }
    render(){
        return(
            <div className="status-bar-container" style={{backgroundColor: '#F6F3FF'}}>
                
                <div className="status-bar-heading-container">
                    <p  className="status-bar-heading">Term Insurance</p>
                    <p  className="status-bar-tag">Must have</p>
                </div>

                <div className="status-bar">
                    <div className="status-bar-background" style={{backgroundColor: '#FAF9FE'}}>
                        <div className="status-bar-progress" style={{backgroundColor: '#4F2DA7', width: '39%'}}></div>
                    </div>
                    
                    <div className="status-bar-numbers">
                        <p className="status-bar-number-left">{numDifferentiation(0, true)}</p>
                        <p className="status-bar-number-right">{numDifferentiation(100000, true)}</p>
                    </div>
                </div>

                <div className="status-bar-info-container">
                    <div className="status-bar-info">
                        <p className="status-bar-info-circle" style={{backgroundColor: '#4F2DA7'}}></p>
                        <p className="status-bar-info-text">Current Coverage</p>
                    </div>
                    <div className="status-bar-info">
                        <p className="status-bar-info-circle" style={{backgroundColor: '#FAF9FE'}}></p>
                        <p className="status-bar-info-text">Coverage gap -  <span>{numDifferentiation(300000, true)}</span> </p>
                    </div>
                </div>
            </div>
        )
    }
}

export default StatusBar;
