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
                backgroundColor={getConfig().styles.highlightColor}
                textColor={'#767E86'}
                place={'bottom'}
                arrowColor={getConfig().styles.highlightColor}
                // arrowColor={'transparent'}
                effect="solid"
                multiline={true}
                />
        );
    }
};

const Tooltip = (props) => (
    <TooltipClass
        {...props} />
);

export default Tooltip;
