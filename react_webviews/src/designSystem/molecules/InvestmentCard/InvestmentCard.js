/*
    This component is divided into four section => header, pills, input field and footer.
    the structure of each section is an object which will have all the content related data.
     Sections are => pillsSection, inputFieldSection and footerSection
        1. Each section has an property of 'hide'(by default value is false), changing this value will give a collapsible animation.
        
    
    Usage: 
    <InvestmentCard
        headerTitle='Heading subtitle one or two lines'
        pillsSection={{
        leftLabel: 'Investment Type',
        value,
        onChange:handleChange,
        pillsChild: [
            {
            label: 'SIP',
            },
            {
            label: 'Lumpsum',
            },
        ],
        }}
        inputFieldSection={{
        leftTitle: 'Sip Amount',
        leftSubtitle: 'Rs. 100 min',
        inputFieldProps: {
            label: 'Enter amount',
        },
        }}
        footerSection={{
        hide: value === 1,
        leftTitle: 'Monthly SIP date',
        leftSubtitle: 'Subtitle',
        rightTitle: '15th every month',
        onFooterRightSectionClick: () => {
            console.log('footer right side clicked');
        },
        }}
    />

    Note:
        1. InputFields, Pill, Pills => for more info regarding the props, please look into their molecule.
        2. Strongly recommended to only use foundation colors.
            Example => headerTitleColor: 'foundationColors.secondary.mango.300'

*/

import { Typography } from '@mui/material';
import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Separator from '../../atoms/Separator';
import { Pill, Pills } from '../../atoms/Pills';
import InputField from '../InputField';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import './InvestmentCard.scss';

const InvestmentCard = ({
  imgHeaderSrc,
  imgHeaderProps,
  headerTitle,
  headerTitleColor,
  pillsSection = {},
  inputFieldSection = {},
  footerSection = {},
}) => {
  const isFooterRightSectionClickable = isFunction(
    footerSection?.onFooterRightSectionClick
  );
  return (
    <div className='invest-card-wrapper'>
      <div className='ic-header-wrapper'>
        <Imgc
          src={imgHeaderSrc}
          style={{ width: '32px', height: '32px', marginRight: '16px' }}
          className='ic-header-img'
          {...imgHeaderProps}
        />
        <Typography variant='body1' color={headerTitleColor} component='div'>
          {headerTitle}
        </Typography>
      </div>

      <Collapse in={!pillsSection?.hide}>
        <div>
          <Separator />
          <div className='ic-pills-wrapper'>
            <Typography
              variant='body1'
              component='div'
              className='ic-pill-left-label'
              color={pillsSection?.leftLabelColor}
            >
              {pillsSection?.leftLabel}
            </Typography>
            <Pills
              value={pillsSection?.value}
              onChange={pillsSection?.onChange}
              allowScrollButtonsMobile={false}
              {...pillsSection?.pillsProps}
            >
              {pillsSection?.pillsChild?.map((pillProps, idx) => {
                return <Pill {...pillProps} key={idx} />;
              })}
            </Pills>
          </div>
        </div>
      </Collapse>

      <Collapse in={!inputFieldSection?.hide}>
        <div>
          <Separator />
          <div className='ic-input-field-section'>
            <div className='ic-left-section'>
              <Typography
                variant='body1'
                color={inputFieldSection?.leftTitleColor}
                component='div'
              >
                {inputFieldSection?.leftTitle}
              </Typography>
              <Typography
                variant='body5'
                color={inputFieldSection?.leftSubtitleColor}
                component='div'
              >
                {inputFieldSection?.leftSubtitle}
              </Typography>
            </div>
            <div className='ic-right-section'>
              <InputField {...inputFieldSection?.inputFieldProps} />
            </div>
          </div>
        </div>
      </Collapse>

      <Collapse in={!footerSection?.hide}>
        <div>
          <Separator />
          <div className='ic-footer-section'>
            <div className='ic-left-section'>
              <Typography
                variant='body1'
                color={footerSection?.leftTitleColor}
                component='div'
              >
                {footerSection?.leftTitle}
              </Typography>
              <Typography
                variant='body5'
                color={footerSection?.leftSubtitleColor}
                component='div'
              >
                {footerSection?.leftSubtitle}
              </Typography>
            </div>
            <div
              className={`ic-right-section ${
                isFooterRightSectionClickable && 'cursor-pointer'
              }`}
              onClick={footerSection?.onFooterRightSectionClick}
            >
              <Typography
                variant='body2'
                color={footerSection?.rightTitleColor}
                component='div'
              >
                {footerSection?.rightTitle}
              </Typography>
              <Imgc
                src={footerSection?.imgSrc}
                style={{ width: '24px', height: '24px', marginLeft: '8px' }}
                {...footerSection?.imgProps}
              />
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

InvestmentCard.defaultProps = {
  inputSectionSubtitleColor: 'foundationColors.content.secondary',
  footerSectionSubtitleColor: 'foundationColors.content.secondary',
  pillsSection: {},
  inputFieldSection: {},
  footerSection: {},
};

InvestmentCard.propTypes = {
  imgHeaderProps: PropTypes.object,
  headerTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  headerTitleColor: PropTypes.string,
  pillsSection: PropTypes.shape({
    leftLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    leftLabelColor: PropTypes.string,
    pillsChild: PropTypes.arrayOf(PropTypes.object),
    onChange: PropTypes.func,
    pillsProps: PropTypes.object,
    hide: PropTypes.bool,
  }),
  inputFieldSection: PropTypes.shape({
    leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    leftTitleColor: PropTypes.string,
    leftSubtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    leftSubtitleColor: PropTypes.string,
    inputFieldProps: PropTypes.object,
    hide: PropTypes.bool,
  }),
  footerSection: PropTypes.shape({
    leftTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    leftSubtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    rightTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    leftTitleColor: PropTypes.string,
    leftSubtitleColor: PropTypes.string,
    rightTitleColor: PropTypes.string,
    onFooterRightSectionClick: PropTypes.func,
    imgProps: PropTypes.object,
    hide: PropTypes.bool,
  }),
};

export default InvestmentCard;
