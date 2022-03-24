import React, { useMemo } from "react";
import { Imgc } from "../../../common/ui/Imgc";

import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import noop from "lodash/noop";

import { getConfig } from "../../../utils/functions";
import { formatAmountInr } from "../../../utils/validators";

import "./mini-components.scss";

export const AccountType = ({
  data = {},
  amount = "",
  isFree = false,
  isSelected = false,
  onElementClick = noop,
  handleClick = noop,
}) => {
  const { productName } = useMemo(() => {
    return getConfig();
  }, []);
  return (
    <div className={`aoc-account-type ${isSelected && "aoc-selected-account"}`}>
      {data.icon && (
        <div className="flex-between-center aat-top-content">
          <Imgc
            src={require(`assets/${productName}/aoc_trading.svg`)}
            className="aat-top-icon"
          />
          {data.showRadioIconWithImage && (
            <RadioIcon isSelected={isSelected} onClick={handleClick} />
          )}
        </div>
      )}
      <div className="flex-between-center">
        <div className="aat-title">{data.title}</div>
        {data.showRadioIconWithTitle && (
          <RadioIcon isSelected={isSelected} onClick={handleClick} />
        )}
      </div>
      <SubtitleList subtitleList={data.subtitleList} />
      <KeyPoints keyPoints={data.keyPoints} onElementClick={onElementClick} />
      <BottomContent
        isFree={isFree}
        amount={amount}
        data={data.bottomContent}
      />
    </div>
  );
};

const RadioIcon = ({ isSelected, onClick }) => (
  <Imgc
    src={require(`assets/${isSelected ? "selected" : "not_selected"}.svg`)}
    className="aat-check-icon"
    onClick={onClick}
  />
);

const SubtitleList = ({ subtitleList = [] }) => (
  <>
    {!isEmpty(subtitleList) && isArray(subtitleList) && (
      <div className="aat-subtitle-list">
        {subtitleList.map((el, index) => (
          <div key={index} className="aat-sl-content">
            <Imgc src={require(`assets/check.svg`)} className="aat-sl-icon" />
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
      <div className="aat-keypoints">
        {keyPoints.map((el, index) => (
          <div key={index} className="flex-between-center">
            <div className="aat-keypoints-content">
              <Imgc
                src={require(`assets/${el.icon}.svg`)}
                className="aat-kc-icon"
              />
              <div>{el.title}</div>
            </div>
            {!isEmpty(el.clickableText) && (
              <div className="aat-clickable-text" onClick={onElementClick}>
                {el.clickableText}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </>
);

const BottomContent = ({ data, isFree, amount = 900 }) => (
  <>
    {!isEmpty(data) && (
      <div className="flex-between-center">
        <div className="aat-bc-info">
          <div>{data.title}</div>
          <div>
            <span
              className={`aat-bc-amount ${isFree && "aat-bc-strike-amount"}`}
            >
              {formatAmountInr(amount)}/-
            </span>
            {isFree && <span className="aat-bc-free-tag">Free</span>}
          </div>
        </div>
        {data.isRecommended && (
          <div className="aat-bc-recommended">Recommended</div>
        )}
      </div>
    )}
  </>
);
