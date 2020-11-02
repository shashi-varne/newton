import React, { Component } from 'react'

class StepsToFollow extends Component {
    
    render() {
        return (
                <div className="FiveStepPlan-Container">
                     <div className="FiveStepPlan-Box">
                         <div className='FiveStepPlan-Number'>{this.props.keyId}</div>
                         <div className="FiveStepPlan-Info">
                             <p className="FiveStepPlan-title">{this.props.title}</p>
                             <p className="FiveStepPlan-subtitle">{this.props.subtitle}</p>
                         </div>
                     </div>    
                </div>
        )
    }
}

export default StepsToFollow
