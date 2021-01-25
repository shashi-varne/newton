import React, { Component, Fragment } from 'react'
import { getConfig } from 'utils/functions';
import { nativeCallback } from 'utils/native_callback';
import {formatAmount, containsNumbersAndComma} from 'utils/validators';
import StatusBar from '../../../common/ui/StatusBar';

// import {advisoryConstants} from '../'

class RecommendationResult extends Component { 
    constructor(props){
        super(props);
        this.state = {
            type: getConfig().productName,
        }
    }
    render(){
        return(
            <div className="recommentation-result">
                <StatusBar/>
            </div>
        )
    }
}

export default RecommendationResult
