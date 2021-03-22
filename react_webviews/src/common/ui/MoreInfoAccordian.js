import React, { Component } from 'react';
import SVG from "react-inlinesvg";
import down_arrow from "assets/down_arrow.svg";
import up_arrow from "assets/up_arrow.svg";
import { getConfig } from "utils/functions";

class MoreInfoAccordian extends Component {

    constructor(props){
        super(props);
        this.state = {
            productName: getConfig().productName,
        }
    }

    renderPoints = (props, index) => {
        return (
          <div key={index} className="wic-tile">
            <div className="circle"></div>
            <div className="wic-tile-right">{props}</div>
          </div>
        );
    };
  
    handleClickPoints = (key) => {
        this.setState({
          [key + "_open"]: !this.state[key + "_open"],
          [key + "_clicked"]: true,
        });
    };

    render() {
        var key = this.props.id;
        return (
           <div>
                  <div
                  className="what-is-covered"
                  onClick={() => this.handleClickPoints(key)}
                >
                  <div className="top">
                    <div className="wic-title">{this.props.title}</div>
                    <div className="">
                      <SVG
                        className="text-block-2-img"
                        preProcessor={(code) =>
                          code.replace(/fill=".*?"/g, "fill=#5c5c5c")
                        }
                        src={this.state[`${key}_open`] ? up_arrow : down_arrow}
                      />
                    </div>
                  </div>
                    
                  {this.state[`${key}_open`] && (
                    <div className="content">
                      {this.props.data.map(this.renderPoints)}
                    </div>
                  )}
                </div>

            </div>
        )
    }
}

export default MoreInfoAccordian;
