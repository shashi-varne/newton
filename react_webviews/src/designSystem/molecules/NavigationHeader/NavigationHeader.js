import IconButton from '@mui/material/IconButton';
import Button from '../../atoms/Button';
import React, { useEffect, useRef } from 'react';
import Typography from '../../atoms/Typography';
import { Imgc } from '../../../common/ui/Imgc';
import nav_back from 'assets/nav_back.svg';
import { Tab, Tabs } from '../../atoms/Tabs';

import './NavigationHeader.scss';

const NavigationHeader = ({
  headerTitle,
  showClose,
  hideLeftIcon,
  actionText,
  children,
  selectedTab,
  onTabChange,
  anchorOrigin,
}) => {
  const headerRef = useRef();
  const subtitleRef = useRef();
  const headerTitleRef = useRef();
  useEffect(() => {
    if (anchorOrigin.current) {
      anchorOrigin.current.addEventListener('scroll', onScroll);
    }
  }, []);
  const onScroll = (e) => {
    const el = headerRef.current;
    const anchorScrollToTopPosition = e?.target?.scrollTop;
    const navHeaderTitle = document.getElementsByClassName('nav-header-title')[0];
    const headerTitleHeight = headerTitleRef?.current?.getBoundingClientRect()?.height;
    const subtitleHeight = subtitleRef?.current?.getBoundingClientRect()?.height;
    const headerTitleSubtitleHeight = headerTitleHeight + subtitleHeight;

    subtitleRef.current.style.opacity = 1 - anchorScrollToTopPosition / subtitleHeight;
    let defaultHeight = 56;
    if (window.innerWidth < 500) {
      defaultHeight = 0;
    }
    navHeaderTitle.style.transition = 'opacity 350ms';
    if (anchorScrollToTopPosition > headerTitleHeight) {
      navHeaderTitle.style.opacity = '1';
    } else {
      navHeaderTitle.style.opacity = '0';
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
  };
  const leftIcon = showClose ? '' : nav_back;
  return (
    <div className='nav-header-wrapper' ref={headerRef}>
      <section className='nav-header-top-section'>
        <div className='nav-header-left'>
          {!hideLeftIcon && (
            <IconButton classes={{ root: 'nav-left-icn-btn' }} className='nav-hl-icon-wrapper'>
              <Imgc src={leftIcon} style={{ width: '24px', height: '24px' }} className='nhl-icon' />
            </IconButton>
          )}
          <Typography
            className={`nav-header-title ${hideLeftIcon && 'nav-header-lm'}`}
            variant='heading3'
          >
            {headerTitle}
          </Typography>
        </div>
        <div className='nav-header-right'>
          <Imgc src={''} style={{ width: '24px', height: '24px' }} />
          {actionText && <Button variant='link' title={actionText} />}
        </div>
      </section>
      <div className='nav-bar-title-wrapper' ref={headerTitleRef}>
        <Typography variant='heading2'>{headerTitle}</Typography>
      </div>
      <section className='nav-bar-subtitle-wrapper' ref={subtitleRef}>
        {children}
      </section>
      <section className='nav-bar-tabs-wrapper'>
        <Tabs value={selectedTab} onChange={onTabChange}>
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
          <Tab label='label 1' />
        </Tabs>
      </section>
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

NavigationHeaderSubtitle.defaultProps = {
  color: 'foundationColors.content.secondary',
};

NavigationHeaderPoints.defaultProps = {
  color: 'foundationColors.content.secondary',
};

export default NavigationHeader;
