import "./WVGenericListCardSheet.Scss";
import React from 'react';
import StarRating from "../StarRating";
import { isEmpty } from 'lodash';

function WVGenericListCard(props) {
    const value = props.value;

    return (
        <div className="card wvgeneric-card" onClick={() => props.handleClick()} data-aid={`wvgeneric-card-${props.dataAidSuffix}`}>
            <div className="wvgeneric-card-details">
                <div className="content" data-aid={`wvgeneric-card-content-${props.dataAidSuffix}`}>
                    <div className="title">{props?.title}</div>
                    <div className='subtitle' >{props?.subtitle}
                        <img src={require(`assets/split.svg`)} alt='' className='split-img' />
                        <span className={`star-icon ${props.starclassName}`}><StarRating value={props.morning_star_rating} /> </span>
                    </div>
                </div>
                <img src={props.image} className="amc-logo-small" alt='' />
            </div>


            {!isEmpty(value) &&
                value.map((item, index) => {
                    return (
                        <div className="wvgeneric-card-details" key={index} data-aid={`wvgeneric-card-details-${props.dataAidSuffix}-${index+1}`}>
                            <p className={`tc-title  ${item.className1}`}>{item.title1}{item.tag1}</p>
                            <p className={`tc-title  ${item.className2}`}>{item.title2}{item.tag2}</p>
                        </div>
                    )
                })}
        </div>
    )
};

export default WVGenericListCard;