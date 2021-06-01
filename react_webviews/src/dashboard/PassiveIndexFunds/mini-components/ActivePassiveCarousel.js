import React from "react";
import { Imgc } from "../../../common/ui/Imgc";
function ActivePassiveCarousel({ data }) {
  return (
    <div className="active-passive-carousel">
      <div className="image">
        <Imgc
          style={{ width: "38px", height: "40px" }}
          src={require(`assets/${data.src}`)}
          alt=""
        />
      </div>
      <p className="header">{data.header}</p>
      <div className="body">
        <div className="left">
          <p className="left-title">{data.left.title.toUpperCase()}</p>
          <p className="content">{data.left.content}</p>
        </div>
        <div className="right">
          <p className="right-title">{data.right.title.toUpperCase()}</p>
          <p className="content">{data.right.content}</p>
        </div>
      </div>
    </div>
  );
}

export default ActivePassiveCarousel;
