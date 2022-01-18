/*
  Prop description:
  LandingHeader:
    variant: one of type => 'center', 'side'
    children: this will only accept 'LandingHeaderTitle', 'LandingHeaderSubtitle', 'LandingHeaderPoints', 'LandingHeaderImage'.
    dataAid: unique id.

  LandingHeaderTitle:
    color: color which will be used for the child.
    children: text for the title.

  LandingHeaderSubtitle:
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.

  LandingHeaderPoints:
    This component will convert the Typography child components into list with bullet points.
    children: It will only accept Typography component, which can be a single <Typography/> component,
              or a list of Typography component.
              - dataAid for single Typography will be tv_subtitle.
              - dataAid for list Typography will be tv_subtitle{idx}.
    color: This color will be passed to all the Typography component, you can also override this color by
           passing color to individual Typography item.

  Usage of the component:

   <LandingHeader variant='center'>

      <LandingHeaderImage imgProps={{ src: require('assets/amazon_pay.svg') }} />

      <LandingHeaderTitle>Title</LandingHeaderTitle>

      <LandingHeaderSubtitle color='foundationColors.secondary.mango.300'>

        <Typography>

            These funds essentially {format(new Date(), 'MMM d, yyyy ')} invest in stocks of

            various two line text, limit - 99 characters or 17 words

        </Typography>

        <Typography>

          These funds essentially

          <Typography

            color='foundationColors.secondary.profitGreen.300'

            component='span'

            variant='heading4'

          >of various</Typography>

          two line text, limit - 99 characters or 17 words Hello World

        </Typography>

      </LandingHeaderSubtitle>

      <LandingHeaderPoints>

        <Typography>One line text, limit - 46 characters or 9 words</Typography>

        <Typography>One line text, limit - 46 characters or 9 words</Typography>

        <Typography color='foundationColors.secondary.profitGreen.300'>One line text, limit - 46 characters or 9 words</Typography>

      </LandingHeaderPoints>

    </LandingHeader>


  NOTE: STRONGLY RECOMMENDED TO ONLY USE FOUNDATION COLORS.

  Example to pass color:

    color: 'foundationColors.secondary.mango.300'

*/

import React, { Children } from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import PropTypes from 'prop-types';

import './HeaderTitle.scss';

const HeaderTitle = ({ children, imgProps, dataAid }) => {
  return (
    <div className='ht-wrapper' data-aid={`headerTitle_${dataAid}`}>
      {imgProps?.src && (
        <Imgc src={imgProps?.src} className='ht-left-image' {...imgProps} dataAid='left' />
      )}
      <div className='ht-child-wrapper'>{children}</div>
    </div>
  );
};

HeaderTitle.Title = ({ children, color }) => {
  return (
    <Typography variant='heading2' color={color} dataAid='title'>
      {children}
    </Typography>
  );
};

HeaderTitle.Subtitle = ({ children, color }) => {
  return (
    <Typography className='ht-subtitle' variant='body2' color={color} dataAid='subtitle'>
      {children}
    </Typography>
  );
};

HeaderTitle.SubtitleLabels = ({ children, color }) => {
  return (
    <div className='ht-subtitle-labels'>
      {Children?.map(children, (child, idx) => {
        const childrenLength = children?.length;
        const showSeparator = idx !== 0 && children[idx]?.type?.name === 'Typography';
        const subtitleLabelId = childrenLength > 1 ? idx + 1 : '';
        if (child?.type?.name !== 'Typography') {
          const componentType = child?.type || child?.type?.name;
          console.error(`Only supported child is Typography, passed type is ${componentType}`);
          return null;
        } else {
          return (
            <div key={idx} className='ht-subtitle-label'>
              {showSeparator && (
                <Typography
                  variant='body6'
                  color='foundationColors.supporting.cadetBlue'
                  className='ht-label-separator'
                  data-aid={`divider_${idx}`}
                >
                  |
                </Typography>
              )}
              {React.cloneElement(child, {
                variant: child?.props?.variant || 'body9',
                color: child?.props?.color || color,
                dataAid: `label${subtitleLabelId}`,
                allCaps: true,
              })}
            </div>
          );
        }
      })}
    </div>
  );
};

HeaderTitle.propTypes = {
  children: PropTypes.node,
  imgProps: PropTypes.object,
  dataAid: PropTypes.string,
};

HeaderTitle.defaultProps = {
  imgProps: {},
};

HeaderTitle.Title.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitle.Subtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitle.Subtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

HeaderTitle.SubtitleLabels.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
};

HeaderTitle.SubtitleLabels.defaultProps = {
  color: 'foundationColors.content.secondary',
};

export default HeaderTitle;
