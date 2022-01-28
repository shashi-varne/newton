import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React, { useEffect, useRef } from 'react';
import Typography from '../../atoms/Typography';
import backIcon from 'assets/nav_back.svg';
import closeIcon from 'assets/nav_close.svg';
import { useHistory } from 'react-router-dom';
import { Tab, Tabs } from '../../atoms/Tabs';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import Icon from '../../atoms/Icon';
import { onScroll } from './helperFunctions';
import PropTypes from 'prop-types';

import './NavigationHeader.scss';

const NavigationHeader = ({
  headerTitle,
  hideInPageTitle,
  hideHeaderTitle,
  leftIconSrc,
  onLeftIconClick,
  hideLeftIcon,
  showCloseIcon,
  actionTextProps = {},
  children,
  anchorOrigin,
  rightIconSrc,
  onRightIconClick,
  tabsProps = {},
  tabChilds = [],
}) => {
  const navHeaderWrapperRef = useRef();
  const subtitleRef = useRef();
  const inPageTitleRef = useRef();
  const history = useHistory();
  useEffect(() => {
    if (anchorOrigin?.current) {
      anchorOrigin.current.addEventListener('scroll', handleOnScroll);
    }
  }, []);
  const handleOnScroll = (anchorOriginEl) => {
    onScroll(anchorOriginEl, navHeaderWrapperRef, subtitleRef, inPageTitleRef, hideInPageTitle);
  };

  const handleLeftIconClick = (e) => {
    if (isFunction(onLeftIconClick)) {
      return onLeftIconClick(e);
    }
    history.goBack();
  };
  const leftIcon = leftIconSrc ? leftIconSrc : showCloseIcon ? closeIcon : backIcon;
  return (
    <div className='nav-header-wrapper' ref={navHeaderWrapperRef}>
      <section className='nav-header-top-section'>
        <div className='nav-header-left'>
          {!hideLeftIcon && (
            <IconButton
              classes={{ root: 'nav-left-icn-btn' }}
              className='nav-hl-icon-wrapper'
              onClick={handleLeftIconClick}
            >
              <Icon src={leftIcon} size='24px' />
            </IconButton>
          )}
          {!hideHeaderTitle && (
            <Typography
              className={`nav-header-title ${hideLeftIcon && 'nav-header-lm'} ${
                hideInPageTitle && 'show-nav-title'
              }`}
              variant='heading3'
            >
              {headerTitle}
            </Typography>
          )}
        </div>
        <div className='nav-header-right'>
          {rightIconSrc && <Icon src={rightIconSrc} size='24px' onClick={onRightIconClick} />}
          {actionTextProps?.title && (
            <Button variant='link' title={actionTextProps?.title} {...actionTextProps} />
          )}
        </div>
      </section>
      {!(hideInPageTitle || hideHeaderTitle) && (
        <div className='nav-bar-title-wrapper' ref={inPageTitleRef}>
          <Typography variant='heading2'>{headerTitle}</Typography>
        </div>
      )}
      <section className='nav-bar-subtitle-wrapper' ref={subtitleRef}>
        {children}
      </section>
      {!isEmpty(tabsProps) && !isEmpty(tabChilds) && (
        <section className='nav-bar-tabs-wrapper'>
          <TabsSection tabs={tabsProps} tabChilds={tabChilds} />
        </section>
      )}
    </div>
  );
};

export const NavigationHeaderSubtitle = ({ children, color, dataIdx }) => {
  return (
    <Typography
      className='lh-subtitle'
      dataAid={`subtitle${dataIdx}`}
      variant='body2'
      color={color}
      align='left'
      component='div'
    >
      {children}
    </Typography>
  );
};

export const NavigationHeaderPoints = ({ children, color, dataIdx }) => {
  return (
    <ul className='lh-description-list'>
      <li className='lh-description-item'>
        <Typography
          variant='body2'
          color={color}
          align='left'
          dataAid={`point${dataIdx}`}
          component='div'
        >
          {children}
        </Typography>
      </li>
    </ul>
  );
};

const TabsSection = ({ tabs, tabChilds }) => {
  const { selectedTab = 0, onTabChange, ...restTabs } = tabs;
  return (
    <Tabs value={selectedTab} onChange={onTabChange} {...restTabs}>
      {tabChilds?.map((el, idx) => {
        const value = el?.value || idx;
        return <Tab key={idx} label={el?.label} value={value} {...el} />;
      })}
    </Tabs>
  );
};

NavigationHeader.propTypes = {
  headerTitle: PropTypes.node,
  hideInPageTitle: PropTypes.bool,
  hideHeaderTitle: PropTypes.bool,
  onLeftIconClick: PropTypes.func,
  hideLeftIcon: PropTypes.bool,
  showCloseIcon: PropTypes.bool,
  actionTextProps: PropTypes.object,
  children: PropTypes.node,
  onRightIconClick: PropTypes.func,
  tabsProps: PropTypes.object,
  tabChilds: PropTypes.array,
};

NavigationHeaderSubtitle.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired
};

NavigationHeaderPoints.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  dataIdx: PropTypes.number.isRequired
};

NavigationHeaderSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

NavigationHeaderPoints.defaultProps = {
  color: 'foundationColors.content.secondary',
};

export default NavigationHeader;
