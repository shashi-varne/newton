// -----------------Assets------------------------
import UpwardIcon from 'assets/ic_up_arrow_purple.svg';
import IlsError from 'assets/fisdom/ils_error.svg';
import IlsNoData from 'assets/fisdom/ils_no_data.svg';
// -----------------------------------------------
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'material-ui/IconButton';
import { last, get } from 'lodash';
import { isEmpty, isFunction } from '../../utils/validators';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
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
  const container = useRef();

  useEffect(() => {
    createObserver();
    // Todo: Need to unobserve
  }, [isLoading, error]);

  const createObserver = () => {
    const { current: rootElem } = container;
    if (!isEmpty(rootElem) && !isEmpty(rootElem.children)) {
      const options = {
        root: rootElem,
        // rootMargin: '220px 0px 60px 0px',
        threshold: 0.6,
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
    const [container] = document.getElementsByClassName('iwd-scroll-contain');

    if (currentPage === pages) {
      container.scrollTop -= currentPageHeight * pages;
    } else {
      container.scrollTop += currentPageHeight;
    }
  };

  const Footer = (
    <div id='iwd-page-footer'>
      <IconButton className='iwd-pf-btn' onClick={scrollPage}>
        <img src={UpwardIcon} alt='' className={currentPage < pages ? 'rotate-90' : ''} />
      </IconButton>
      <div id='iwd-pf-page-nos'>
        <b>{currentPage}</b>|{pages}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className='iwd-scroll-contain' ref={container}>
        <IwdScreenLoader loadingText={loadingText} />
      </div>
    );
  } else if (noData) {
    return (
      <ErrorScreen
        useTemplate={true}
        templateImage={IlsNoData}
        templateErrText={
          noDataText ||
          "No data found"
        }
        templateBtnText='Retry'
        clickHandler={onErrorBtnClick}
      />
    );
  } else if (error) {
    return (
      <div className='iwd-scroll-contain' ref={container}>
        <ErrorScreen
          useTemplate={true}
          classes={{
            container: 'iwd-fade'
          }}
          templateImage={IlsError}
          templateErrTitle='Oops!'
          templateErrText={
            errorText ||
            'Something went wrong! Please retry after some time or contact your wealth manager'
          }
          templateBtnText='Retry'
          clickHandler={onErrorBtnClick}
        />
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
