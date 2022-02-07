/*
    This component is divided into four section => header, pills, input field and footer.
    Each section is a subcomponent, and the allowed child to this component are:
      'InvestmentCardHeaderRow', 'InvestmentCardPillsRow', 'InvestmentCardInputRow', 'InvestmentCardBottomRow',
        1. Each section has an property of 'hide'(by default value is false), changing this value will give a collapsible animation.
    
    Usage: 
    <InvestmentCard>
      <InvestmentCardHeaderRow title='Heading subtitle one or two lines' imgSrc={require('assets/amazon_pay.svg')}/>
      <InvestmentCardPillsRow
        title='Investment Type'
        pillsProps={{
          value,
          onChange: handleTabs,
        }}
        pillsChild={[
          {
            label: 'SIP',
          },
          {
            label: 'Lumpsum',
          },
        ]}
      />
      <InvestmentCardInputRow hide={value === 0} title='Sip Amount' subtitle='Rs. 100 min' />
      <InvestmentCardBottomRow
        hide={value === 0}
        leftTitle='Monthly SIP data'
        leftSubtitle='Subtitle'
        rightTitle='15th every month'
        onRightSectionClick={() => {
          console.log('hello');
        }}
        rightImgSrc={require('assets/amazon_pay.svg')}
      />
    </InvestmentCard>

    Note:
        1. InputFields, Pill, Pills => for more info regarding the props, please look into their molecule.
        2. Strongly recommended to only use foundation colors.
            Example => headerTitleColor: 'foundationColors.secondary.mango.300'

*/

import React from 'react';
import Typography from '../../atoms/Typography';
import Separator from '../../atoms/Separator';
import { Pill, Pills } from '../../atoms/Pills';
import InputField from '../InputField';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import './InvestmentCard.scss';
import Icon from '../../atoms/Icon';
import { Stack } from '@mui/material';

export const InvestmentCard = ({ children, dataAid }) => {
  return (
    <div className='invest-card-wrapper' data-aid={`investmentCard_${dataAid}`}>
      {children}
    </div>
  );
};

export const InvestmentCardHeaderRow = ({ imgSrc, imgProps = {}, title, titleColor }) => {
  return (
    <div className='ic-header-wrapper'>
      {imgSrc && <Icon src={imgSrc} size='32px' className='ic-header-left-img' dataAid='left' {...imgProps} />}
      <Typography variant='body1' color={titleColor} component='div' dataAid='title1'>
        {title}
      </Typography>
    </div>
  );
};

export const InvestmentCardPillsRow = ({ hide, title, titleColor, pillsProps, pillsChild }) => {
  return (
    <Collapse in={!hide}>
      <div>
        <Separator dataAid='1' />
        <Stack direction='row' alignItems='center' justifyContent='space-between' className='ic-pills-wrapper'>
          <Typography
            variant='body1'
            component='div'
            className='ic-pill-left-label'
            color={titleColor}
            dataAid='title2'
          >
            {title}
          </Typography>
          <Pills
            value={pillsProps?.value}
            onChange={pillsProps?.onChange}
            variant={pillsProps?.variant}
            allowScrollButtonsMobile={false}
            className='ic-pill'
            {...pillsProps}
          >
            {pillsChild?.map((pillProps, idx) => {
              return <Pill {...pillProps} key={idx} />;
            })}
          </Pills>
        </Stack>
      </div>
    </Collapse>
  );
};

export const InvestmentCardInputRow = ({
  hide,
  title,
  titleColor,
  subtitle,
  subtitleColor,
  inputFieldProps = {},
}) => {
  return (
    <Collapse in={!hide}>
      <div>
        <Separator dataAid='2' />
        <Stack direction='row' alignItems='center' justifyContent='space-between' className='ic-input-field-section'>
          <div className='ic-left-section'>
            <Typography variant='body1' color={titleColor} component='div' dataAid='title3'>
              {title}
            </Typography>
            <Typography variant='body5' color={subtitleColor} component='div' dataAid='subtitle1'>
              {subtitle}
            </Typography>
          </div>
          <div className='ic-right-section'>
            <InputField
              variant='outlined'
              size='small'
              placeholder='Enter amount'
              {...inputFieldProps}
            />
          </div>
        </Stack>
      </div>
    </Collapse>
  );
};

export const InvestmentCardBottomRow = ({
  hide,
  leftTitle,
  leftTitleColor,
  leftSubtitle,
  leftSubtitleColor,
  onRightSectionClick,
  rightTitle,
  rightTitleColor,
  rightImgSrc,
  rightImgProps = {},
}) => {
  const isRightSectionClickable = isFunction(onRightSectionClick);
  return (
    <Collapse in={!hide}>
      <div>
        <Separator dataAid='3' />
        <Stack direction='row' alignItems='center' justifyContent='space-between' className='ic-footer-section'>
          <div className='ic-left-section'>
            <Typography variant='body1' color={leftTitleColor} component='div' dataAid='title4'>
              {leftTitle}
            </Typography>
            <Typography
              variant='body5'
              color={leftSubtitleColor}
              component='div'
              dataAid='subtitle2'
            >
              {leftSubtitle}
            </Typography>
          </div>
          <div
            className={`ic-right-section ${isRightSectionClickable && 'fc-cursor-pointer'}`}
            onClick={onRightSectionClick}
          >
            <Typography variant='body2' color={rightTitleColor} component='div' dataAid='title5'>
              {rightTitle}
            </Typography>
            {rightImgSrc && (
              <Icon
                size='24px'
                src={rightImgSrc}
                className='fc-bottom-right-img'
                dataAid='right'
                {...rightImgProps}
              />
            )}
          </div>
        </Stack>
      </div>
    </Collapse>
  );
};

InvestmentCardInputRow.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
};

InvestmentCardBottomRow.defaultProps = {
  leftSubtitleColor: 'foundationColors.content.secondary',
};

InvestmentCard.propTypes = {
  children: PropTypes.node,
  dataAid: PropTypes.string,
};

InvestmentCardHeaderRow.propTypes = {
  imgProps: PropTypes.object,
  title: PropTypes.node,
  titleColor: PropTypes.string,
};

InvestmentCardPillsRow.propTypes = {
  hide: PropTypes.bool,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  pillsProps: PropTypes.object,
  pillsChild: PropTypes.arrayOf(PropTypes.object),
};

InvestmentCardInputRow.propTypes = {
  hide: PropTypes.bool,
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  inputFieldProps: PropTypes.object,
};

InvestmentCardBottomRow.propTypes = {
  hide: PropTypes.bool,
  leftTitle: PropTypes.node,
  leftTitleColor: PropTypes.string,
  leftSubtitle: PropTypes.node,
  leftSubtitleColor: PropTypes.string,
  onRightSectionClick: PropTypes.func,
  rightTitle: PropTypes.node,
  rightTitleColor: PropTypes.string,
  rightImgProps: PropTypes.object,
};