import React, { Component, Fragment } from 'react'
import Container from '../common/Container';
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {formatAmount, containsNumbersAndComma} from 'utils/validators';
import {advisoryConstants} from '../constants';
import RecommendationResult from './components/recommendation_result';

class AdivsoryRecommendations extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
        }
    }
    render(){
        return(
            <Container
                // events={this.sendEvents('just_set_events')}
                fullWidthButton={true}
                onlyButton={true}
                title="Our recommendations"
                noFooter={true}
                handleClick={()=>this.handleClick()}
            >
                <div className="advisory-recommendations-container">
                    <p className="advisory-sub-text">So you can plan better</p>

                    <div className="rec-profile-container">
                            <p className="rec-profile-heading">Your profile</p>
                            <div className="rec-profile">
                                <div className="rec-profile-left">
                                    <img src={require(`assets/${this.state.type}/advisory_male.svg`)}/>
                                </div>
                                <div className="rec-profile-right">
                                    <p>Shashidhar Varne</p>
                                    <p>Male</p>
                                    <p>24 years</p>
                                    <p>2 dependents</p>
                                </div>
                            </div>
                    </div>

                    <p className="advisory-sub-text" style={{marginTop: '18px'}}>It's great that you've already planned for you life with X policy but you're short on adequate coverage</p>
                    <p style={{fontSize: '17px', fontWeight: 'bold', margin:'30px 0 20px 0', color: '#160D2E' }}>Here's what we recommend</p>
                    
                    <RecommendationResult/>
                </div>
            </Container>
        )
    }
}

export default AdivsoryRecommendations
