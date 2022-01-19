import { Box, FormControl, FormControlLabel, RadioGroup } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '../../atoms/Typography';
import PropTypes from 'prop-types';

import './SelectionMode.scss';
import RadioButton from '../../atoms/RadioButton';

const RenderSelection = ({
  className,
  sx,
  title,
  titleColor,
  titleVariant,
  subtitle,
  subtitleColor,
  leftImgProps,
  leftImgSrc,
  rightImgSrc,
  rightImgProps,
}) => {
  return (
    <Box className={`selection-mode-wrapper ${className}`} sx={sx}>
      {leftImgSrc && (
        <Imgc
          src={leftImgSrc}
          dataAid='left'
          className='selection-mode-left-img'
          {...leftImgProps}
        />
      )}
      <div className='sm-right-wrapper'>
        <div className='sm-text-wrapper'>
          {title && (
            <Typography variant={titleVariant} color={titleColor} component='div' dataAid='title'>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant='body5' color={subtitleColor} component='div' dataAid='subtitle'>
              {subtitle}
            </Typography>
          )}
        </div>
        {rightImgSrc && (
          <Imgc
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

export const SelectionModeRadio = ({ options, selectedValue, handleChange }) => {
  return (
    <FormControl component='fieldset' className='selection-mode-form-wrapper'>
      <RadioGroup className='sm-radio-wrapper' value={selectedValue} name='alternateFund' onChange={handleChange}>
        {options?.map((el, idx) => {
          return (
            <FormControlLabel
              key={idx}
              value={el?.value}
              disabled={el?.disabled}
              labelPlacement='start'
              control={<RadioButton isChecked={el?.value === selectedValue} />}
              label={<RenderSelection {...el} />}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
};

const SelectionMode = ({ variant, ...props }) => {
  if (variant === 'radio') {
    return <SelectionModeRadio {...props} />;
  } else {
    return <RenderSelection {...props} />;
  }
};

RenderSelection.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
  titleVariant: 'body1'
};

RenderSelection.propTypes = {
    titleVariant: PropTypes.oneOf(['body1', 'body2'])
}

export default SelectionMode;
