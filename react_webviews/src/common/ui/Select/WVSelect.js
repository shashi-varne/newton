/*

Use: Custom selection mechanism used for fullscreen selection designs
TODO: Get Figma link from design team for all components

Example syntax:
  <WVSelect
    preselectFirst={true}
    options={[ ... ]} ***required***
    indexBy="prop_name" ***required***
    titleProp="title_prop_name"
    subtitleProp="subtitle_prop_name"
    onChange={() => {}}
  />
  (OR)
  For custom option rendering
  <WVSelect
    preselectFirst={true}
    options={[ ... ]} ***required***
    indexBy="prop_name" ***required***
    onChange={() => {}}
    renderItem={custom_rendering_function_or_component}
  />
*/

/* Asset Imports */
import completed_step from "assets/completed_step.svg";
/* ------------- */
import './WVSelect.scss';
import React, { useEffect, useState } from 'react';
import { isFunction, findIndex } from 'lodash';
import PropTypes from 'prop-types';

const WVSelect = ({
  preselectFirst, // Set this to preselect the first option from 'options' list
  options, // Array of objects to be displayed as select options
  indexBy, // Prop name to track select option by (used for equality comparison) 
  value, // Preselected value (if any)
  titleProp, // Name of prop to render title for select option
  subtitleProp, // Name of prop to render subtitle for select option
  onChange, // Callback for when any select option is selected/changed
  renderItem, // Use this prop to pass a custom render function/component for select option
  classes,
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

  const renderOptionProps = {
    titleProp,
    subtitleProp,
    renderItem,
    onClick: selectOpt,
    classes
  };

  return (
    <div className={`wv-select-container ${classes.container}`}>
      {options?.map((option, idx) =>
        <RenderOption
          key={option[indexBy]}
          option={option}
          optionIndex={idx}
          selected={option[indexBy] === selectedOpt[indexBy]}
          {...renderOptionProps}
        />
      )}
    </div>
  );
}

const RenderOption = (props) => {
  const {
    option,
    optionIndex,
    selected,
    onClick,
    renderItem,
    titleProp,
    subtitleProp,
    classes = {},
  } = props;

  return (
    <div
      className={`wv-select-item ${classes.item} ${selected ? 'selected' : ''}`}
      style={{ padding: subtitleProp ? '10px 22px' : '20px 22px'}}
      key={optionIndex}
      onClick={() => onClick?.(optionIndex)}
    >
      <div className={`wv-select-item-content ${classes.itemContent}`}>
        {isFunction(renderItem) ?
          renderItem(option) :
          <>
            {titleProp && <Title className={classes.title}>{option[titleProp]}</Title>}
            {subtitleProp && <Subtitle className={classes.subtitle}>{option[subtitleProp]}</Subtitle>}
          </>
        }
      </div>
      {selected &&
        <img
          className={`wv-select-selected-icon ${classes.selectedIcon}`}
          src={completed_step}
          alt="Check"
        />
      }
    </div>
  );
}

const Title = (props) => {
  return (<div className={`wv-select-item-title ${props.className}`}>
    {props.children}
  </div>)
};

WVSelect.ItemTitle = Title;

const Subtitle = (props) => {
  return (<div className={`wv-select-item-subtitle ${props.className}`}>
    {props.children}
  </div>)
};

WVSelect.ItemSubtitle = Subtitle;

WVSelect.propTypes = {
  preselectFirst: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  indexBy: PropTypes.string.isRequired,
  value: PropTypes.object,
  titleProp: PropTypes.string,
  subtitleProp: PropTypes.string,
  onChange: PropTypes.func,
  renderItem: PropTypes.func,
};

WVSelect.defaultProps = {
  preselectFirst: false,
  classes: {},
}

export default WVSelect;
