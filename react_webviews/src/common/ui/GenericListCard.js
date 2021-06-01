import React from 'react'
import PassiveStarRating from "./PassiveStarRating"
// import { isEmpty } from "utils/validators";

function GenericListCard(props) {
    const data = props.data;
    const data1 = props.data1
    const data2 = props.data2
    const data3 = props.data3

    return (
        <div className="card generic-card" onClick={() => props.handleClick()}>
            <div className="generic-card-details">
                <div className="content">
                    <div className="title">{data.legal_name}</div>
                    <div className='subtitle' >{data.fund_house}
                        <img src={require(`assets/split.svg`)} alt='' className='split-img' />
                        <PassiveStarRating value={data.morning_star_rating} />
                    </div>
                </div>
                <img src={data.amc_logo_big} className="amc-logo-small" alt='' style={{ width: "50px", height: "50px" }} />
            </div>

            <div className="generic-card-details">
                <p className="tc-title">{props.title1}</p>
                <p className="tc-title">{props.title2}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title">{data[data1] ? data[data1]+"%" : "Na"}</p>
                <p className="tc-title return">{data[data2] ? data[data2]+"%" : "Na"}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title">{props.title3}</p>
            </div>
            <div className="generic-card-details">
                <p className="tc-title">{data[data3] ? data[data3]+"%" : "Na"}</p>
            </div>


        </div>
    )
};

export default GenericListCard;