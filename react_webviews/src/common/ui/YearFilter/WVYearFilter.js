/*

Use: List of Years in a row and user can pick any one year from the list

Example syntax:
<WVYearFilter> 
filterArray={YEARS_FILTERS}                           // Array of YearslIST
selected={this.state.yearValue}                       // Selected Year from the array of YearsList
onClick={this.yearFilter}                             // oncLICK Action [yearFilter]
</WVYearFilter>
*/


import "./WVYearFilterSheet.scss"
import React from 'react'
import { isEmpty } from 'lodash';

function WVYearFilter(props) {

    const selected = props.selected;
    const data = props.filterArray;

    return (
        <div className="year-filter">
            {!isEmpty(data) &&
                data.map((item, index) => {
                    return (
                        <p className={`text-block ${selected === item.text ? 'selected' : ''}`} onClick={() => props.onClick(item.text)} key={index}>
                            {item.text}
                        </p>
                    );
                })}
        </div>
    )
};

export default WVYearFilter;