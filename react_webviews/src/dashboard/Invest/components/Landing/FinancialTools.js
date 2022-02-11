import React from "react";
import Button from "../../../../common/ui/Button";
import { Imgc } from "../../../../common/ui/Imgc";

const FinancialTools = ({ handleClick, financialTools, productName }) => {
  return (
    <div className="bottom-scroll-cards">
      <div className="list" data-aid="financial-tools-list">
        {financialTools.map((data, index) => {
          return (
            <div
              data-aid={`financial-tool-${data.key}`}
              className="card invest-card financial-card"
              onClick={handleClick(data.key)}
              key={index}
            >
              <div className="content">
                <div
                  className="title"
                  data-aid={`financial-tool-title-${data.key}`}
                >
                  {data.title}
                </div>
                <Imgc
                  src={require(`assets/${productName}/${data.icon}`)}
                  alt=""
                  className="ft-icon"
                />
              </div>
              <div
                className="subtitle"
                data-aid={`financial-tool-subtitle-${data.key}`}
              >
                {data.subtitle}
              </div>
              <Button
                dataAid="financial-tool-btn"
                buttonTitle={data.button_text}
                classes={{
                  button: "invest-landing-button",
                }}
                type="outlined"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FinancialTools;
