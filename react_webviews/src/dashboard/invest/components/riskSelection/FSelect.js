import React, { useEffect, useState } from 'react';
import completed_step from "assets/completed_step.svg";
import './FSelect.scss';
const FSelect = ({
  options,
  indexBy,
  value,
  titleProp,
  onChange,
  renderItem,
}) => {
  const [selectedOpt, selectOpt] = useState(value || {});

  const changeOpt = (index) => {
    const oldOpt = selectedOpt;
    const newOpt = options[index];
    if (oldOpt[indexBy] === newOpt[indexBy]) return;
    selectOpt(newOpt);
  };

  useEffect(() => {
    onChange?.(selectedOpt);
  }, [selectedOpt]);

  if (!indexBy) {
    return (
      <div>Please provide indexBy prop</div>
    );
  }

  const renderOptionProps = {
    titleProp,
    renderItem,
    onClick: changeOpt
  };
  return (
    <div className="fselect-container">
      {options.map((opt, idx) =>
        <RenderOption
          key={opt[indexBy]}
          opt={opt}
          idx={idx}
          selected={opt[indexBy] === selectedOpt[indexBy]}
          {...renderOptionProps}
        />
      )}
    </div>
  );
}

const RenderOption = (props) => {
  const { opt, idx, selected, titleProp, onClick, renderItem } = props;

  return (
    <div
      className={`fselect-item ${selected ? 'selected' : ''}`}
      key={idx}
      onClick={() => onClick?.(idx)}
    >
      <div className="fselect-item-content">
      {
        renderItem?.(opt) || 
        <div className="fselect-item-title">
          {opt[titleProp] || '--'}
        </div>
      }
      </div>
      {selected &&
        <img
          className="fselect-selected-icon"
          src={completed_step}
          alt="Check"
        />
      }
    </div>
  );
}

export default FSelect;