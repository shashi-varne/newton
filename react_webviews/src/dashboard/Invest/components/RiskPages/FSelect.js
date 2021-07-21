import React, { useEffect, useState } from 'react';
import './FSelect.scss';
import { findIndex, isFunction } from 'lodash';
import { getConfig } from '../../../../utils/functions';

const productName = getConfig().productName;
const FSelect = ({
  preselectFirst,
  options,
  indexBy,
  value,
  titleProp,
  onChange,
  renderItem,
}) => {
  const [selectedOpt, setSelectedOpt] = useState(value || {});

  const selectOpt = (index) => {
    const oldOpt = selectedOpt;
    const newOpt = options[index];
    if (oldOpt[indexBy] === newOpt[indexBy]) return;
    setSelectedOpt(newOpt);
  };

  useEffect(() => {
    if (isFunction(onChange)) {
      onChange(selectedOpt);
    }
  }, [selectedOpt]);
  
  useEffect(() => {
    if (preselectFirst) {
      selectOpt(0);
    }
    if (value) {
      selectOpt(findIndex(options, { [indexBy]: value }));
    }
  }, []);

  if (!indexBy) {
    return (
      <div>Please provide indexBy prop</div>
    );
  }

  const renderOptionProps = {
    titleProp,
    renderItem,
    onClick: selectOpt
  };
  return (
    <div className="fselect-container" data-aid='fselect-container'>
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
  const { opt, idx, selected, onClick, renderItem } = props;

  if (isFunction(renderItem) && renderItem(opt)) {
    return (
      <div
        data-aid={`fselect-item-${idx+1}`}
        className={`fselect-item ${selected ? 'selected' : ''}`}
        key={idx}
        onClick={() => onClick?.(idx)}
      >
        <div className="fselect-item-content" data-aid='fselect-item-content'>
          {
            renderItem(opt)
          }
          {/* <div className="fselect-item-title">
              {opt[titleProp] || '--'}
            </div> */}
        </div>
        {selected &&
          <img
            className="fselect-selected-icon"
            src={require(`assets/${productName}/completed_step.svg`)}
            alt="Check"
          />
        }
      </div>
    );
  }

  return '';
}

export default FSelect;