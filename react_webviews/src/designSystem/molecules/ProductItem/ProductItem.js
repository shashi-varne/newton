import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '../../atoms/Typography';
import Tags from '../Tags';
import Separator from '../../atoms/Separator';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import PropTypes from 'prop-types';

import './ProductItem.scss';

const ProductItem = (props) => {
  let {
    leftImgProps,
    rightImgProps,
    header,
    leftTagVariant,
    middleTagVariant,
    bottomTitle,
    rightTitle,
    rightSubtitle,
    separator,
  } = merge({}, defaultValues, props);
  return (
    <div className='product-item-parent'>
      <div className='product-item-wrapper'>
        {leftImgProps?.src && (
          <Imgc
            src={leftImgProps?.src}
            style={{
              width: '40px',
              height: '40px',
              marginRight: '8px',
            }}
            dataAid='left'
            {...leftImgProps}
          />
        )}
        <div className='pi-right-wrapper'>
          <div className='pi-child-wrapper'>
            <div className='pi-left-section'>
              <Typography variant='body2' color={header?.color} component='div'>
                {header?.name}
              </Typography>
              <div className='pi-ls-bottom-section'>
                {!isEmpty(leftTagVariant) && <Tags {...leftTagVariant} className='pi-left-tag' />}
                {!isEmpty(middleTagVariant) && (
                  <Tags {...middleTagVariant} className={bottomTitle?.name ? 'p-right-tag' : ''} />
                )}
                {bottomTitle?.name && (
                  <Typography className='left-section-text' color={bottomTitle?.color} variant='body2' align='right'>
                    {bottomTitle?.name}
                  </Typography>
                )}
              </div>
            </div>
            <div className='pi-right-section'>
              {!rightImgProps?.src ? (
                <div className='pi-right-text-wrapper'>
                  <Typography variant='body1' align='right' color={rightTitle?.color}>
                    {rightTitle?.name}
                  </Typography>
                  <Typography variant='body2' align='right' color={rightSubtitle?.color}>
                    {rightSubtitle?.name}
                  </Typography>
                </div>
              ) : (
                <Imgc
                  src={rightImgProps?.src}
                  style={{
                    width: '32px',
                    height: '32px',
                    marginLeft: '8px',
                  }}
                  {...rightImgProps}
                />
              )}
            </div>
          </div>
          {separator && <Separator marginTop='16px' />}
        </div>
      </div>
    </div>
  );
};

const defaultValues = {
  rightSubtitle: {
    color: 'foundationColors.content.tertiary',
  },
  bottomTitle: {
    color: 'foundationColors.content.secondary',
  }
};

ProductItem.defaultProps = {
  leftImgProps : {},
  rightImgProps : {},
  header : {},
  leftTagVariant : {},
  middleTagVariant : {},
  bottomTitle : {},
  rightTitle : {},
  rightSubtitle : {},
  separator: false,
};

ProductItem.propTypes = {
  leftImgProps : PropTypes.object,
  rightImgProps : PropTypes.object,
  header : PropTypes.exact({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    color: PropTypes.string
  }),
  leftTagVariant: PropTypes.object,
  middleTagVariant: PropTypes.object,
  bottomTitle: PropTypes.exact({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    color: PropTypes.string
  }),
  rightTitle: PropTypes.exact({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    color: PropTypes.string
  }),
  rightSubtitle: PropTypes.exact({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    color: PropTypes.string
  }),
  separator: PropTypes.bool,
}

export default ProductItem;
