import React, { useMemo } from "react";
import { Imgc } from "../../../common/ui/Imgc";
import { getConfig } from "../../../utils/functions";
import WVClickableTextElement from "../../../common/ui/ClickableTextElement/WVClickableTextElement";

import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import noop from "lodash/noop";
import "./mini-components.scss";

export const AccountType = ({
  data = {},
  isSelected = false,
  isRecommended,
  showRadioIconWithTitle = false,
  showRadioIconWithImage = false,
  onElementClick = noop,
}) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);

  return (
    <div className="aoc-account-type">
      {data.icon && (
        <div className="flex-between-center">
          <Imgc src={`assets/${productName}/${data.icon}`} />
          {showRadioIconWithImage && (
            <RadioIcon isSelected={isSelected} productName={productName} />
          )}
        </div>
      )}
      <div className="flex-between-center">
        <div>{data.title}</div>
        {showRadioIconWithTitle && (
          <RadioIcon isSelected={isSelected} productName={productName} />
        )}
      </div>
      <SubtitleList subtitleList={data.subtitleList} />
      <KeyPoints keyPoints={data.keyPoints} onElementClick={onElementClick} />
    </div>
  );
};

const RadioIcon = ({ productName, isSelected }) => (
  <Imgc
    src={require(`assets/${productName}/${
      isSelected ? "selected" : "not_selected"
    }.svg`)}
  />
);

const SubtitleList = ({ subtitleList = [] }) => (
  <>
    {!isEmpty(subtitleList) && isArray(subtitleList) && (
      <div>
        {subtitleList.map((el, index) => (
          <div key={index}>
            <Imgc src={require(`assets/check.svg`)} />
            <div>{el}</div>
          </div>
        ))}
      </div>
    )}
  </>
);

const KeyPoints = ({ keyPoints = [], onElementClick }) => (
  <>
    {!isEmpty(keyPoints) && isArray(keyPoints) && (
      <div>
        {keyPoints.map((el, index) => (
          <div key={index}>
            <div>
              <Imgc src={require(`assets/${el.icon}.svg`)} />
              <div>{el.title}</div>
            </div>
            <WVClickableTextElement onClick={onElementClick}>
              {el.clickableText}{" "}
            </WVClickableTextElement>
          </div>
        ))}
      </div>
    )}
  </>
);
