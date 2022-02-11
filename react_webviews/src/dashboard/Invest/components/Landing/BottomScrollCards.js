import React from "react";
import { Imgc } from "../../../../common/ui/Imgc";
import isEmpty from "lodash/isEmpty";

const BotomScrollCards = ({ handleClick, bottomScrollCards, productName }) => {
  return (
    <div
      className="bottom-scroll-cards"
      data-aid="bottomScrollCards-title"
    >
      <div className="list" data-aid="bottomScrollCards-list">
        {!isEmpty(bottomScrollCards) &&
          bottomScrollCards.map((item, index) => {
            return (
              <div
                data-aid={item.key}
                key={index}
                className="card scroll-card"
                onClick={handleClick(item.key, item.title)}
              >
                <div className="title">{item.title}</div>
                <div className="icons">
                  <img
                    src={require(`assets/${productName}/${item.icon_line}`)}
                    alt=""
                  />
                  <Imgc
                    src={require(`assets/${productName}/${item.icon}`)}
                    alt=""
                    className="icon"
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BotomScrollCards;
