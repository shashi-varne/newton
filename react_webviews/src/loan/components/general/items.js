import React from 'react';
import "../Style.scss";

// import CustomizedSlider from "../../../common/ui/Slider";

const Items = (props) => {

    const { name, amount, max, min } = props
    
    return (
        <div className="container">
            <div className="contents">
                <span className="name">{name}</span>
                <span className="amount">{amount}</span>
            </div>
            <div className="contents">
                <span className="min">{min}</span>
                <span className="max">{max}</span>
            </div>
        </div>
    );
}
 
export default Items;