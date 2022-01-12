import React from 'react';
import {Imgc} from '../../../common/ui/Imgc';
import Typography from '../../atoms/Typography';
import Tags from '../Tags';

import './ProductItem.scss';

const ProductItem = ({
  leftImgSrc,
  leftImgSrcProps = {},
  title,
  leftTagVariant = {},
  rightTagVariant = {},
  rightTitle,
  rightSubtitle
}) => {
  return (
    <div>
      <div className='product-item-wrapper'>
        <Imgc
          src={leftImgSrc}
          style={{ width: '40px', height: '40px', marginRight: '8px' }}
          {...leftImgSrcProps}
        />
        <div className='pi-right-wrapper'>
          <div className='pi-left-section'>
            <Typography variant='body2'>{title}</Typography>
            <div className='pi-ls-bottom-section'>
              {leftTagVariant && <Tags {...leftTagVariant} />}
              {rightTagVariant && <Tags {...rightTagVariant} />}
            </div>
          </div>
          <div className='pi-right-section'>
              <Typography variant='body1'>{rightTitle}</Typography>
              <Typography variant='body2' color='foundationColors.content.tertiary'>{rightSubtitle}</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
