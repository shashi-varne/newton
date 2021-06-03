import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import Tooltips from './TooltipLite';
import {Imgc} from 'common/ui/Imgc';


class GenericTooltip extends Component {

    handleChildClick = (e) => {
        e.stopPropagation();
      }
    
    render() {
        return (
            <div onClick={this.handleChildClick}> 
            <Tooltips className="generic-tooltip" classNameArrow="tooltip-arrrow" background={getConfig().highlight_color}
            backgroundArrow={getConfig().highlight_color}
              direction="down-end" content={this.props.content}>
              <Imgc style={{width: '14px', height: '14px'}} src={require(`assets/${this.props.productName}/info_icon.svg`)} alt="" />
            </Tooltips>
            </div>
        );
    }
};


export default GenericTooltip;
