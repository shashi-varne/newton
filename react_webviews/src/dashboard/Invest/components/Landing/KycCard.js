import React from "react";
import { Imgc } from "../../../../common/ui/Imgc";
import { SkeltonRect } from "../../../../common/ui/Skelton";

const KycCard = ({ handleClick, data, productName, showLoader }) => {
  return (
    <>
      {showLoader ? (
        <SkeltonRect
          style={{
            width: "100%",
            height: "85px",
            marginBottom: "15px",
          }}
        />
      ) : (
        <div
          data-aid="kyc-invest-sections-cards"
          className="kyc"
          onClick={handleClick}
        >
          <div className="kyc-card-text">
            <div className="title">{data.title}</div>
            <div className={`subtitle ${data.subTitleClass}`}>
              {data.addPoint ? (
                <span
                  className="point"
                  style={
                    data.subtitleColor
                      ? {
                          backgroundColor: data.subtitleColor,
                        }
                      : {}
                  }
                />
              ) : null}
              <span>{data.subtitle}</span>
            </div>
          </div>
          <Imgc
            className="kyc-card-image"
            src={require(`assets/${productName}/${data.icon}`)}
            alt=""
          />
        </div>
      )}
    </>
  );
};

export default KycCard;
