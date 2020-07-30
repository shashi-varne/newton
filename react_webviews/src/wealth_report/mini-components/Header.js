import React, { Component } from 'react';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() { 
        return ( 
            <div id="wr-header-bar">
                <div id="wr-header-pan-select" className="wr-header-tab"></div>
                <div className="wr-header-tab">
                    <img alt="overview" src={require()} />
                  Overview
                </div>
                <div className="wr-header-tab">Analysis</div>
                <div className="wr-header-tab">Holdings</div>
                <div className="wr-header-tab">Taxation</div>
            </div>
        );
    }
}
 
export default Header;