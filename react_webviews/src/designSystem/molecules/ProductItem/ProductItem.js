import React from 'react';
import { Imgc } from '../../../common/ui/Imgc';
import Typography from '../../atoms/Typography';
import Tag from '../Tag';
import Separator from '../../atoms/Separator';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import isFunction from 'lodash/isFunction';
import PropTypes from 'prop-types';

import './ProductItem.scss';
import Button from '../../atoms/Button';

const ProductItem = (props) => {
  let {
    leftImgSrc,
    leftImgProps,
    headerTitle,
    headerTitleColor,
    showSeparator,
    onClick,
    bottomSection = {},
    rightSection = {},
    dataAid,
  } = merge({}, defaultValues, props);
  return (
    <div className='product-item-wrapper' onClick={onClick} data-aid={`productItem_${dataAid}`}>
      {leftImgSrc && (
        <Imgc src={leftImgSrc} className='product-item-left-img' dataAid='left' {...leftImgProps} />
      )}
      <div className='pi-right-wrapper'>
        <div className='pi-child-wrapper'>
          <div className='pi-left-section'>
            <Typography variant='body2' color={headerTitleColor} component='div'>
              {headerTitle}
            </Typography>
            <BottomSection {...bottomSection} />
          </div>
          {(!isEmpty(rightSection?.description) || !isEmpty(rightSection?.btnProps)) && (
            <div className='pi-right-section'>
              <RightSection {...rightSection} />
            </div>
          )}
        </div>
        {showSeparator && <Separator marginTop='16px' />}
      </div>
    </div>
  );
};

const BottomSection = ({ tagOne = {}, tagTwo = {}, titleOne, titleOneColor }) => {
  return (
    <div className='pi-ls-bottom-section'>
      {!isEmpty(tagOne) && <Tag {...tagOne} className='pi-ls-bottom-item' />}
      {!isEmpty(tagTwo) && <Tag {...tagTwo} className='pi-ls-bottom-item' />}
      {titleOne && (
        <Typography
          className='pi-ls-bottom-item'
          color={titleOneColor}
          variant='body2'
          align='right'
          component='div'
        >
          {titleOne}
        </Typography>
      )}
    </div>
  );
};

const RightSection = (props) => {
  const { btnProps = {}, description = {} } = props;
  if (!isEmpty(btnProps)) {
    const handleClick = (e) => {
      if (isFunction(btnProps?.onClick)) {
        e.stopPropagation();
        return btnProps?.onClick(e);
      }
    };
    return (
      <Button title={btnProps?.title} variant='secondary' {...btnProps} onClick={handleClick} />
    );
  } else if (!isEmpty(description)) {
    return <Description {...description} />;
  }
};

const Description = ({ title, titleColor, subtitle, subtitleColor }) => {
  if (!title && !subtitle) return null;
  return (
    <div className='pi-right-text-wrapper'>
      <Typography variant='body1' align='right' color={titleColor} component='div'>
        {title}
      </Typography>
      <Typography variant='body2' align='right' color={subtitleColor} component='div'>
        {subtitle}
      </Typography>
    </div>
  );
};

const defaultValues = {
  leftImgProps: {},
  rightSection: {
    description: {
      subtitleColor: 'foundationColors.content.tertiary',
    },
    btnProps: {},
  },
  bottomSection: {
    tagOne: {},
    tagTwo: {},
    titleOneColor: 'foundationColors.content.tertiary',
  },
};

ProductItem.propTypes = {
  leftImgProps: PropTypes.object,
  headerTitle: PropTypes.node,
  headerTitleColor: PropTypes.string,
  showSeparator: PropTypes.bool,
  bottomSection: PropTypes.exact({
    tagOne: PropTypes.object,
    tagTwo: PropTypes.object,
    titleOne: PropTypes.node,
    titleOneColor: PropTypes.string,
  }),
  rightSection: PropTypes.exact({
    btnProps: PropTypes.object,
    description: PropTypes.exact({
      title: PropTypes.node,
      titleColor: PropTypes.string,
      subtitle: PropTypes.node,
      subtitleColor: PropTypes.string,
    }),
  }),
};

export default ProductItem;
