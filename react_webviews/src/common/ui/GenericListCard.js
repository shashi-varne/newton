import React from 'react'
import StarRating from "./StarRating"

function GenericListCard(props) {
    const data = props.data;
    const value = props.value;
    const data1 = value.data1
    const data2 = value.data2
    const data3 = value.data3

    return (
        <div className="card generic-card" onClick={() => props.handleClick()}>
            <div className="generic-card-details">
                <div className="content">
                    <div className="title">{data[props?.title]}</div>
                    <div className='subtitle' >{data[props?.subtitle]}
                        <img src={require(`assets/split.svg`)} alt='' className='split-img' />
                        <span className='star-icon'><StarRating value={data.morning_star_rating} /> </span>
                    </div>
                </div>
                <img src={data.amc_logo_big} className="amc-logo-small" alt='' />
            </div>

            <div className="generic-card-details">
                <p className="tc-title">{value.title1}</p>
                <p className="tc-title">{value.title2}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title return">{data[data1] ? data[data1] + "%" : "Na"}</p>
                <p className="tc-title return color">{data[data2] ? data[data2] + "%" : "Na"}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title">{value.title3}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title return">{data[data3] ? data[data3] + "% (1Y)" : "Na"}</p>
            </div>
        </div>
    )
};

export default GenericListCard;