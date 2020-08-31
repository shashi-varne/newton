import React, { Component } from 'react';
import './style.css';
import { getConfig } from 'utils/functions';
import ReactTooltip from "react-tooltip";


class TooltipClass extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };

    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    render() {
        return (
            <ReactTooltip
                backgroundColor={getConfig().highlight_color}
                textColor={'#767E86'}
                place={'bottom'}
                // arrowColor={getConfig().highlight_color}
                arrowColor={'transparent'}
                // effect="float"
                />
        );
    }
};

const Tooltip = (props) => (
    <TooltipClass
        {...props} />
);

export default Tooltip;
