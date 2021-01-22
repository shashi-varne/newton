// -----------------Assets------------------------
import UpwardIcon from 'assets/ic_up_arrow_purple.svg';
// -----------------------------------------------
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'material-ui/IconButton';
import { last, get } from 'lodash';
import { isEmpty, isFunction } from '../../utils/validators';
import IwdErrorScreen from '../mini-components/IwdErrorScreen';
import IwdScreenLoader from './IwdScreenLoader';

const SnapScrollContainer = ({
  pages = 1,
  children: scrollChildren = '',
  onPageChange = () => {},
  hideFooter = false,
  error = false,
  errorText = '',
  isLoading = false,
  loadingText = '',
  noData = false,
  noDataText = '',
  onErrorBtnClick = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageHeight, setCurrentPageHeight] = useState(0);
  const [showBtnGlow, setShowBtnGlow] = useState(false);
  const container = useRef();

  useEffect(() => {
    createObserver();
    // Todo: Need to unobserve
    if (!isLoading && !error) {
      setTimeout(() => setShowBtnGlow(true), 4000);
    }
  }, [isLoading, error]);

  const createObserver = () => {
    const { current: rootElem } = container;
    if (!isEmpty(rootElem) && !isEmpty(rootElem.children)) {
      const options = {
        root: rootElem,
        // rootMargin: '220px 0px 60px 0px',
        threshold: [0.4, 0.6],
      };
  
      const childElems = [].slice
        .apply(rootElem.children)
        .filter((domElem) => domElem.className === 'iwd-scroll-child');
      
        let observer = new IntersectionObserver(handleIntersect, options);
      for (let i = childElems.length; i--; ) {
        observer.observe(childElems[i]);
      }
    }
  };

  const handleIntersect = (entries, observer) => {
    const page = last(entries);
    const pageNumber = parseInt(get(page, 'target.dataset.pgno', ''), 10);
    if (pageNumber) {
      setCurrentPage(pageNumber);
      isFunction(onPageChange) && onPageChange(pageNumber);
    }
    const pageHeight = get(page, 'boundingClientRect.height', 0);
    setCurrentPageHeight(pageHeight);
  };

  const scrollPage = () => {
    setShowBtnGlow(false);
    const [container] = document.getElementsByClassName('iwd-scroll-contain');

    if (currentPage === pages) {
      container.scrollTop -= currentPageHeight * pages;
    } else {
      container.scrollTop += currentPageHeight;
    }
  };

  const Footer = (
    <div id='iwd-scroll-contain-footer'>
      <IconButton className={`${showBtnGlow ? 'iwd-btn-glow' : ''} iwd-pf-btn`} onClick={scrollPage}>
        <img src={UpwardIcon} alt='' className={currentPage < pages ? 'iwd-rotate-180' : 'iwd-rotate-180-reverse'} />
      </IconButton>
      <div id='iwd-pf-page-nos'>
        <b>0{currentPage}</b>|0{pages}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className='iwd-scroll-contain'>
        <div className="iwd-scroll-child">
          <IwdScreenLoader loadingText={loadingText} />
        </div>
      </div>
    );
  } else if (noData) {
    return (
      <div className='iwd-scroll-contain'>
        <div className="iwd-scroll-child">
          <IwdErrorScreen
            hasNoData={true}
            templateErrText={
              noDataText ||
              "No data found"
            }
          />
        </div>
      </div>
    );
  } else if (error) {
    return (
      <div className='iwd-scroll-contain'>
        <div className="iwd-scroll-child">
          <IwdErrorScreen
            hasError={true}
            templateErrTitle='Oops!'
            templateErrText={
              errorText ||
              'Something went wrong! Please retry after some time or contact your wealth manager'
            }
            templateBtnText='Retry'
            clickHandler={onErrorBtnClick}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='iwd-scroll-contain' ref={container}>
        {scrollChildren}
      </div>
      {!hideFooter && !error && Footer}
    </>
  );
};

export default SnapScrollContainer;
