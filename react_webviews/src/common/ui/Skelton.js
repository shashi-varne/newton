
import React, { Component } from 'react';
import { getConfig } from 'utils/functions';

import ReactPlaceholder from 'react-placeholder';
import "react-placeholder/lib/reactPlaceholder.css";

class UiSkeltonClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: getConfig().productName
        };
    }
    render() {
       
        return (
            <div className="Loader">
            <ReactPlaceholder type='media' rows={7} ready={this.state.ready}>
              
            </ReactPlaceholder>
          </div>
        );
    }
};

const UiSkelton = (props) => (
    <UiSkeltonClass
        {...props} />
);

export default UiSkelton;
