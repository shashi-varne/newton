/*
  Prop Description:
  className: can pass custom className
  sx: support Mui sx props,
  title: Title to be displayed.
  variant: 'default' and 'radio'
    - by default => 'default' variant is selected (component name used below => DefaultSelectionMode)

  RadioSelectionMode Props description:
    selectedValue => pass default selected value
    handleChange => use this function to change the selected value.
    options => this is an array of object.
      structure : [
        {
          value: <any value>,
          ...restProps of DefaultSelectionMode
        },
        {
          value: <any value>,
          ...restProps of DefaultSelectionMode
        }
      ]
*/

import { Box, FormControl, FormControlLabel, RadioGroup } from '@mui/material';
import React from 'react';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';

import './SelectionMode.scss';
import RadioButton from '../../atoms/RadioButton';
import Icon from '../../atoms/Icon';
import { FONT_WEIGHT } from '../../../theme/typography';

const SelectionMode = ({ variant, dataAid, className, ...props }) => {
  return (
    <div className={`selection-mode-wrapper ${className}`}  data-aid={`selectionMode_${dataAid}`}>
      {variant === 'radio' && <RadioSelectionMode dataAid={dataAid} {...props} />}
      {variant === 'default' && <DefaultSelectionMode {...props} />}
    </div>
  );
};

const DefaultSelectionMode = ({
  className,
  sx,
  title,
  titleColor,
  titleVariant,
  leftImgProps,
  leftImgSrc,
  rightImgSrc,
  rightImgProps,
  isSelected
}) => {
  return (
    <Box className={`selection-mode-wrapper ${className}`} sx={sx}>
      {leftImgSrc && (
        <Icon
          size='32px'
          src={leftImgSrc}
          dataAid='left'
          className='selection-mode-left-img'
          {...leftImgProps}
        />
      )}
      <div className='sm-right-wrapper'>
        <div className='sm-text-wrapper'>
          {title && (
            <Typography
            variant={titleVariant}
            color={titleColor}
            component="div"
            dataAid="title"
            sx={{
              fontWeight: isSelected ? FONT_WEIGHT.Medium : FONT_WEIGHT.Regular,
            }}
           >
            {title}
            </Typography>
          )}
        </div>
        {rightImgSrc && (
          <Icon
            size='24px'
            src={rightImgSrc}
            dataAid='right'
            className='selection-mode-right-img'
            {...rightImgProps}
          />
        )}
      </div>
    </Box>
  );
};

const RadioSelectionMode = ({ options, selectedValue, handleChange, dataAid }) => {
  return (
    <FormControl component='fieldset' className='selection-mode-form-wrapper'>
      <RadioGroup
        className='sm-radio-wrapper'
        value={selectedValue}
        name='alternateFund'
        onChange={handleChange}
      >
        {options?.map((el, idx) => {
          delete el?.rightImgSrc;
          const isSelected = el.value === selectedValue;
          return (
            <FormControlLabel
              key={idx}
              value={el?.value}
              disabled={el?.disabled}
              labelPlacement='start'
              control={<RadioButton isChecked={isSelected} />}
              label={<DefaultSelectionMode isSelected={isSelected} {...el} />}
              data-aid={`selectionMode_${dataAid}${idx+1}`}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

SelectionMode.propTypes = {
  variant: PropTypes.oneOf(['default', 'radio']),
};

SelectionMode.defaultProps = {
  variant: 'default',
};

DefaultSelectionMode.defaultProps = {
  titleVariant: 'body1',
};

DefaultSelectionMode.propTypes = {
  title: PropTypes.node,
  titleColor: PropTypes.string,
  leftImgProps: PropTypes.object,
  rightImgProps: PropTypes.object,
  titleVariant: PropTypes.oneOf(['body1', 'body2']),
};

export default SelectionMode;
