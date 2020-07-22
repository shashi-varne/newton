import React, { Component } from 'react';
import "../Style.scss";
import { formatAmount } from "../../../utils/validators";

import CustomizedSlider from "../../../common/ui/Slider";

class Items extends Component {
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
        this.props.onChange(val, this.props.name)
    };

    render() {
        return (
            <div className="container">
                <div className="content-1">
                    <span className="name">{this.props.name}</span>
                    <span className="amount">
                        {this.props.name !== "Loan tenor" ?
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
 
export default Items;