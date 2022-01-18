/*
  Props description:
  title, subtitle => string/node
  titleColor, subtitleColor => pass foundation colors for these.
  subTitleLabels: it is an array of Objects for label name and its color.
  subTitleLabels structure is: 
  [
    {
      name: 'Some Name',
      color : 'foundationColors.secondary.profitGreen.300'
    }
  ]
  NOTE: STRONGLY RECOMMENDED TO USE ONLY FOUNDATION COLORS
  Example: 
  titleColor: 'foundationColors.secondary.mango.300'
*/

import React from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './HeaderTitle.scss';

const HeaderTitle = ({
  imgSrc,
  imgProps = {},
  title,
  titleColor,
  subtitle,
  subtitleColor,
  dataAid,
  subTitleLabels = [],
}) => {
  return (
    <div className='ht-wrapper' data-aid={`headerTitle_${dataAid}`}>
      {imgSrc && <Imgc src={imgSrc} className='ht-left-image' dataAid='left' {...imgProps} />}
      <div className='ht-child-wrapper'>
        <Typography variant='heading2' color={titleColor} dataAid='title'>
          {title}
        </Typography>
        <Typography variant='body2' color={subtitleColor} dataAid='title'>
          {subtitle}
        </Typography>
        {Array.isArray(subTitleLabels) && <SubtitleLabels subTitleLabels={subTitleLabels} />}
      </div>
    </div>
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
            <Typography variant='body9' color={label.color || labelColor} allCaps dataAid={`label${idx+1}`}>
              {label.name}
            </Typography>
            {showSeparator && (
              <Typography
                variant='body6'
                color='foundationColors.supporting.cadetBlue'
                className='ht-label-separator'
                data-aid={`divider_${idx+1}`}
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
  title: PropTypes.node,
  titleColor: PropTypes.string,
  subtitle: PropTypes.node,
  subtitleColor: PropTypes.string,
  subTitleLabels: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  imgProps: PropTypes.object,
  dataAid: PropTypes.string,
};

HeaderTitle.defaultProps = {
  imgProps: {},
  subtitleColor: 'foundationColors.content.secondary'
};

export default HeaderTitle;
