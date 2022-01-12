import React from 'react';
import {Imgc} from '../../../common/ui/Imgc';
import Typography from '../../atoms/Typography';
import Tags from '../Tags';
import Separator from '../../atoms/Separator';
import isEmpty from 'lodash/isEmpty';

import './ProductItem.scss';

const ProductItem = ({
  leftImgProps = {},
  title,
  titleColor,
  leftTagVariant = {},
  middleTagVariant = {},
  rightTitle,
  rightTitleColor,
  rightSubtitle,
  rightSubtitleColor,
  leftSectionTitle,
  separator,
  rightImgProps={}
}) => {
  return (
    <div>
      <div className='product-item-wrapper'>
        {
          leftImgProps?.src &&
          <Imgc
          src={leftImgProps?.src}
          style={{ width: '40px', height: '40px', marginRight: '8px' }}
          {...leftImgProps}
          />
        }
        <div className='pi-right-wrapper'>
          <div className='pi-child-wrapper'>
            <div className='pi-left-section'>
              <Typography variant='body2' color={titleColor} component='div'>{title}</Typography>
              <div className='pi-ls-bottom-section'>
                {!isEmpty(leftTagVariant) && <Tags {...leftTagVariant} className='pi-left-tag'/>}
                {!isEmpty(middleTagVariant) && <Tags {...middleTagVariant} className={leftSectionTitle ? 'p-right-tag' : ''}/>}
                {leftSectionTitle && <Typography className='left-section-text' variant='body1' align='right'>{leftSectionTitle}</Typography>}
              </div>
            </div>
            <div className='pi-right-section'>
              {
                !rightImgProps?.src ?
                <div className='pi-right-text-wrapper'>
                <Typography variant='body1' align='right' color={rightTitleColor}>{rightTitle}</Typography>
                <Typography variant='body2' align='right' color={rightSubtitleColor}>{rightSubtitle}</Typography>
                </div>
               :
                <Imgc
                src={rightImgProps?.src}
                style={{ width: '32px', height: '32px', marginRight: '8px' }}
                {...rightImgProps?.imgProps}
                />
              }
            </div>
          </div>
          { separator && <Separator marginTop='16px'/> }
        </div>

      </div>
    </div>
  );
};

export default ProductItem;

ProductItem.defaultProps = {
  rightSubtitleColor: 'foundationColors.content.tertiary'
}
