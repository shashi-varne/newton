import React from "react";

const PopularCards = ({ clickCard, data, productName }) => {
  return (
    <div className="bottom-scroll-cards">
      <div className="list" data-aid="popularCards-tools-list">
        {data.map((item, index) => {
          return (
            <div
              data-aid={`popular-cards-${item.key}`}
              key={index}
              className="card popular"
              onClick={clickCard(item.key, item.title)}
              style={{
                backgroundImage: `url(${require(`assets/${productName}/${item.icon}`)})`,
              }}
            >
              <div className="title">{item.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCards;
