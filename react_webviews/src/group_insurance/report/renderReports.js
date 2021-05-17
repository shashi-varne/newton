import React, { Component } from 'react'
import DetailsCard from '../../common/ui/DetailsCard';
import { Fragment } from 'react';
import { getConfig } from 'utils/functions';
    
class RenderReports extends Component {
    constructor(props){
        super(props);
         this.state = {
             productName: getConfig().productName,
         }
    }
    render() {
        var selectedReport = this.props.reports;
        return (
            <div className={this.props.class}>
                {selectedReport && selectedReport.length > 0 ?
                  <Fragment>
                    <p className="report-top-text" id={`id_${this.props.class}`}>{this.props.topText}</p>
                  {selectedReport.map((report, index) =>(
                      <DetailsCard key={index} handleClick={this.props.redirectCards} item={report}/>
                  ))}
                  </Fragment>
                  : (
                    <Fragment>
                    <img className="inactive-policy-background" alt="empty-policy-background" src={require(`assets/${this.state.productName}/inactive-policy-background.svg`)}/>
                    <p className="empty-state-text"> {this.props.bottomText} </p>
                    </Fragment>
                  )
              }
            </div>
        )
    }
}

export default RenderReports;
