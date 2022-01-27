import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React, { useEffect, useRef } from 'react';
import Typography from '../../atoms/Typography';
import backIcon from 'assets/nav_back.svg';
import { Tab, Tabs } from '../../atoms/Tabs';

import './NavigationHeader.scss';
import isEmpty from 'lodash/isEmpty';
import Icon from '../../atoms/Icon';

const NavigationHeader = ({
  headerTitle,
  hideInPageTitle,
  hideHeaderTitle,
  leftIconSrc,
  hideLeftIcon,
  showCloseIcon,
  actionText,
  actionTextProps = {},
  children,
  anchorOrigin,
  rightIconSrc,
  onRightIconClick,
  tabsProps = {},
}) => {
  const headerRef = useRef();
  const subtitleRef = useRef();
  const headerTitleRef = useRef();
  useEffect(() => {
    if (anchorOrigin?.current) {
      anchorOrigin.current.addEventListener('scroll', onScroll);
    }
  }, []);
  const onScroll = (e) => {
    const el = headerRef.current;
    const anchorScrollToTopPosition = e?.target?.scrollTop;
    const navHeaderTitle = document.getElementsByClassName('nav-header-title')[0];
    const headerTitleHeight = headerTitleRef?.current?.getBoundingClientRect()?.height || 0;
    const subtitleHeight = subtitleRef?.current?.getBoundingClientRect()?.height || 0;
    const headerTitleSubtitleHeight = headerTitleHeight + subtitleHeight;
    const opacityValue = 1 - anchorScrollToTopPosition / subtitleHeight;
    subtitleRef.current.style.opacity = opacityValue > 0 ? opacityValue : 0;
    let defaultHeight = el.style.paddingTop || 60;
    if (window.innerWidth < 500) {
      defaultHeight = 0;
    }
    if (headerTitleRef?.current) {
      headerTitleRef.current.style.transition = 'transform 350ms';
    }
    if (anchorScrollToTopPosition >= headerTitleSubtitleHeight) {
      el.classList.add('nav-header-fixed');
      el.style.top = `${defaultHeight - headerTitleSubtitleHeight}px`;
      e['target']['style']['paddingTop'] = `${el?.getBoundingClientRect()?.height}px`;
    } else {
      el.classList.remove('nav-header-fixed');
      el.style.top = '0px';
      e['target']['style']['paddingTop'] = '0px';
    }
    if (!navHeaderTitle || hideInPageTitle) return;
    navHeaderTitle.style.transition = 'opacity 350ms';
    if (anchorScrollToTopPosition > headerTitleHeight) {
      navHeaderTitle.style.opacity = '1';
    } else {
      navHeaderTitle.style.opacity = '0';
    }
  };
  const leftIcon = leftIconSrc ? leftIconSrc : showCloseIcon ? '' : backIcon;
  return (
    <div className='nav-header-wrapper' ref={headerRef}>
      <section className='nav-header-top-section'>
        <div className='nav-header-left'>
          {!hideLeftIcon && (
            <IconButton classes={{ root: 'nav-left-icn-btn' }} className='nav-hl-icon-wrapper'>
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
          {actionText && <Button variant='link' title={actionText} {...actionTextProps} />}
        </div>
      </section>
      {!(hideInPageTitle || hideHeaderTitle) && (
        <div className='nav-bar-title-wrapper' ref={headerTitleRef}>
          <Typography variant='heading2'>{headerTitle}</Typography>
        </div>
      )}
      <section className='nav-bar-subtitle-wrapper' ref={subtitleRef}>
        {children}
      </section>
      {!isEmpty(tabsProps) && (
        <section className='nav-bar-tabs-wrapper'>
          <TabsSection tabs={tabsProps?.tabs} tabChild={tabsProps?.tabChild} />
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

const TabsSection = ({ tabs, tabChild }) => {
  const { selectedTab = 0, onTabChange, ...restTabs } = tabs;
  return (
    <Tabs value={selectedTab} onChange={onTabChange} {...restTabs}>
      {tabChild?.map((el, idx) => {
        const value = el?.value || idx;
        return <Tab key={idx} label={el?.label} value={value} {...el} />;
      })}
    </Tabs>
  );
};

NavigationHeaderSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

NavigationHeaderPoints.defaultProps = {
  color: 'foundationColors.content.secondary',
};

export default NavigationHeader;
