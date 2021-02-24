import React, { Component } from 'react';
import "./style.scss";
import { formatAmount } from "../../utils/validators";

import CustomizedSlider from "./Slider";

class SliderWithValues extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
        }
    };

    onChange = (val) => {
        this.setState({
            value: `${val}`
        })
        this.props.onChange(val, this.props.val)
    };

    render() {
        return (
            <div className="slide-container">
                <div className="content-1">
                    <span className="name">{this.props.label}</span>
                    <span className="amount">
                        {this.props.label !== "Loan tenor" ?
                            '₹ '+formatAmount(this.state.value) :
                            this.state.value + " months"
                        }
                    </span>
                </div>
                <CustomizedSlider 
                    min={this.props.min}
                    max={this.props.max}
                    default={this.props.value}
                    onChange={this.onChange}
                />
                <div className="content-2">
                    <span className="min">{this.props.minValue}</span>
                    <span className="max">{this.props.maxValue}</span>
                </div>
            </div>
        );
    };
};

export default SliderWithValues;