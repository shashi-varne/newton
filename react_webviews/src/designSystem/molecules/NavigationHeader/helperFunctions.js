export const onScroll = (anchorOriginEl, navHeaderWrapperRef, subtitleRef, inPageTitleRef, hideInPageTitle) => {
  const navHeaderWrapperEl = navHeaderWrapperRef?.current;
  const subtitleWrapperEl = subtitleRef?.current;
  const anchorScrollTopPosition = anchorOriginEl?.target?.scrollTop;
  const navHeaderTitleEl = document.getElementsByClassName('nav-header-title')[0];
  const inPageTitleHeight = inPageTitleRef?.current?.getBoundingClientRect()?.height || 0;
  const subtitlesHeight = subtitleWrapperEl?.getBoundingClientRect()?.height || 0;
  const inPageTitleSubtileTotalHeight = inPageTitleHeight + subtitlesHeight;
  const subtitleWrapperOpacityValue = 1 - anchorScrollTopPosition / subtitlesHeight;
  subtitleWrapperEl.style.opacity =
    subtitleWrapperOpacityValue > 0 ? subtitleWrapperOpacityValue : 0;
  let defaultHeight = 60; // this is the height of the main desktop header.
  if (window.innerWidth < 500) {
    defaultHeight = 0;
  }
  if (inPageTitleRef?.current) {
    inPageTitleRef.current.style.transition = 'transform 350ms';
  }
  if (anchorScrollTopPosition >= inPageTitleSubtileTotalHeight) {
    navHeaderWrapperEl.classList.add('nav-header-fixed');
    navHeaderWrapperEl.style.top = `${defaultHeight - inPageTitleSubtileTotalHeight}px`;
    anchorOriginEl.target.style.paddingTop = `${navHeaderWrapperEl?.getBoundingClientRect()?.height}px`;
  } else {
    navHeaderWrapperEl.classList.remove('nav-header-fixed');
    navHeaderWrapperEl.style.top = '0px';
    anchorOriginEl.target.style.paddingTop = '0px';
  }
  if (!navHeaderTitleEl || hideInPageTitle) return;
  navHeaderTitleEl.style.transition = 'opacity 350ms';
  if (anchorScrollTopPosition > inPageTitleHeight) {
    navHeaderTitleEl.style.opacity = '1';
  } else {
    navHeaderTitleEl.style.opacity = '0';
  }
};
