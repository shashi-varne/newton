import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import Tooltips from './TooltipLite';


class GenericTooltip extends Component {

    handleChildClick = (e) => {
        e.stopPropagation();
      }
    
    render() {
        return (
            <div onClick={this.handleChildClick}> 
            <Tooltips className="generic-tooltip" classNameArrow="tooltip-arrrow" background={getConfig().styles.highlightColor}
            backgroundArrow={getConfig().styles.highlightColor}
              direction="down-end" content={this.props.content}>
              <img src={require(`assets/${this.props.productName}/info_icon.svg`)} alt="" />
            </Tooltips>
            </div>
        );
    }
};


export default GenericTooltip;
