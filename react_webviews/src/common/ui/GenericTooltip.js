import React, { Component } from 'react';
import { getConfig } from 'utils/functions';
import Tooltips from './TooltipLite';


class GenericTooltip extends Component {
    render() {
        return (
            <Tooltips className="generic-tooltip" classNameArrow="tooltip-arrrow" background={getConfig().highlight_color}
            backgroundArrow={getConfig().highlight_color}
              direction="down-end" content={this.props.content}>
              <img src={require(`assets/${this.props.productName}/info_icon.svg`)} alt="" />
            </Tooltips>
        );
    }
};


export default GenericTooltip;
