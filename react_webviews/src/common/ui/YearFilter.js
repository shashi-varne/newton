import React from 'react'
import { isEmpty } from 'lodash';

function YearFilter(props) {

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

export default YearFilter;