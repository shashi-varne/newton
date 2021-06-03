import React from 'react'
import StarRating from "./StarRating"
import { isEmpty } from "utils/validators";

function GenericListCard(props) {
    const value = props.value;

    return (
        <div className="card generic-card" onClick={() => props.handleClick()}>
            <div className="generic-card-details">
                <div className="content">
                    <div className="title">{props?.title}</div>
                    <div className='subtitle' >{props?.subtitle}
                        <img src={require(`assets/split.svg`)} alt='' className='split-img' />
                        <span className='star-icon'><StarRating value={props.morning_star_rating} /> </span>
                    </div>
                </div>
                <img src={props.img_src} className="amc-logo-small" alt='' />
            </div>


            {!isEmpty(value) &&
                value.map((item, index) => {
                    return (
                        <div className="generic-card-details" key={index}>
                            <p className={`tc-title  ${item.className}`}>{item.title1}{item.tag1}</p>
                            <p className={`tc-title  ${item.className}`}>{item.title2}{item.tag2}</p>
                        </div>
                    )
                })}
        </div>
    )
};

export default GenericListCard;