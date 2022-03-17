export const onScroll = (
  anchorOriginEl,
  navHeaderWrapperRef,
  subtitleRef,
  inPageTitleRef,
  hideInPageTitle,
  tabWrapperRef
) => {
  const navHeaderWrapperEl = navHeaderWrapperRef?.current;
  const subtitleWrapperEl = subtitleRef?.current;
  const inPageTitleEl = inPageTitleRef?.current;
  const tabWrapperEl = tabWrapperRef?.current;
  const anchorScrollTopPosition = anchorOriginEl?.target?.scrollTop;
  const navHeaderTitleEl = document.getElementsByClassName('nav-header-title')[0];
  const inPageTitleHeight = inPageTitleEl?.getBoundingClientRect()?.height || 0;
  const subtitlesHeight = subtitleWrapperEl?.getBoundingClientRect()?.height || 0;
  const inPageTitleSubtileTotalHeight = inPageTitleHeight + subtitlesHeight;
  const subtitleWrapperOpacityValue = 1 - anchorScrollTopPosition / subtitlesHeight;
  subtitleWrapperEl.style.opacity =
    subtitleWrapperOpacityValue > 0 ? subtitleWrapperOpacityValue : 0;
  let defaultHeight = 60; // this is the height of the main desktop header.
  if (window.innerWidth < 500) {
    defaultHeight = 0;
  }
  if (inPageTitleEl) {
    inPageTitleRef.current.style.transition = 'transform 350ms';
  }

  const navbarTitleFromTop = defaultHeight - inPageTitleSubtileTotalHeight;

  if (!navHeaderTitleEl || hideInPageTitle) return;
  navHeaderTitleEl.style.transition = 'opacity 350ms';
  if (anchorScrollTopPosition > inPageTitleHeight) {
    navHeaderTitleEl.style.opacity = '1';
  } else {
    navHeaderTitleEl.style.opacity = '0';
  }
  if (!tabWrapperEl) return;
  if (navbarTitleFromTop >= navHeaderWrapperEl?.getBoundingClientRect()?.top) {
    tabWrapperEl.classList.add('tab-position-change');
  } else {
    tabWrapperEl.classList.remove('tab-position-change');
  }
};

export const setTabPadding = (tabWrapperEl, navHeaderWrapperEl, subtitleEl) => {
  subtitleEl.style.paddingBottom = '24px';
  navHeaderWrapperEl.style.paddingBottom = `${tabWrapperEl?.getBoundingClientRect()?.height}px`;
};

export const getEvents = (events, user_action) => {
  if (!events?.properties?.user_action) return;
  events.properties.user_action = user_action;
  return events;
};
