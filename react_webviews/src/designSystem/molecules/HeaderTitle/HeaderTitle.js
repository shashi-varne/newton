/*
  Props description:
  titleColor, subtitleColor => strongly recommended to use only foundation colors.
  subTitleLabels: it is an array of Objects for label and its color.
  subTitleLabels structure is: [{name: 'Some Name', color : 'foundationColors.secondary.profitGreen.300'}]
  Example: 
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './HeaderTitle.scss';

const HeaderTitle = ({ ImgSrc, children, imgProps, subTitleLabels, dataAid }) => {
  return (
    <div className='ht-wrapper' data-aid={`headerTitle_${dataAid}`}>
      <Imgc
        src={ImgSrc}
        style={{ width: '40px', height: '40px' }}
        {...imgProps}
        dataAid='left'
      />
      <div className='ht-child-wrapper'>
        {children}
        {Array.isArray(subTitleLabels) && (
          <SubtitleLabels subTitleLabels={subTitleLabels} />
        )}
      </div>
    </div>
  );
};

HeaderTitle.Title = ({ children, titleColor }) => {
  return (
    <Typography variant='heading2' color={titleColor} data-aid='tv_title'>
      {children}
    </Typography>
  );
};

HeaderTitle.Subtitle = ({ children, subtitleColor }) => {
  return (
    <Typography className='ht-subtitle' variant='body2' color={subtitleColor} data-aid='tv_subtitle'>
      {children}
    </Typography>
  );
};

const SubtitleLabels = ({ subTitleLabels }) => {
  const labelColor = 'foundationColors.content.secondary';
  return (
    <div className='ht-subtitle-labels'>
      {subTitleLabels?.map((label, idx) => {
        if (!label?.name) return null;
        const showSeparator = subTitleLabels[idx + 1]?.name;
        return (
          <div key={idx} className='ht-subtitle-label'>
            <Typography variant='body9' color={label.color || labelColor} allCaps>
              {label.name}
            </Typography>
            {showSeparator && (
              <Typography
                variant='body6'
                color='foundationColors.supporting.cadetBlue'
                className='ht-label-separator'
              >
                |
              </Typography>
            )}
          </div>
        );
      })}
    </div>
  );
};

HeaderTitle.propTypes = {
  children: PropTypes.node,
  subTitleLabels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  dataAid: PropTypes.string,
};

HeaderTitle.defaultProps = {
  imgProps: {},
  subTitleLabels: [],
};

HeaderTitle.Title.propTypes = {
  children: PropTypes.node,
  titleColor: PropTypes.string,
};

HeaderTitle.Subtitle.propTypes = {
  children: PropTypes.node,
  subtitleColor: PropTypes.string,
};

HeaderTitle.Subtitle.defaultProps = {
  subtitleColor: 'foundationColors.content.secondary',
};

export default HeaderTitle;
