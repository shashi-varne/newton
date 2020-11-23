// -----------------Assets------------------------
import DownwardIcon from 'assets/ic_down_arrow_purple.svg';
import UpwardIcon from 'assets/ic_up_arrow_purple.svg';
import IlsError from 'assets/fisdom/ils_error.svg';
// -----------------------------------------------
import React, { useEffect, useState } from 'react';
import IconButton from 'material-ui/IconButton';
import { last, get } from 'lodash';
import { isFunction } from '../../utils/validators';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';

const SnapScrollContainer = ({
  pages = 1,
  children: scrollChildren = '',
  onPageChange = () => {},
  hideFooter = false,
  error = false,
  onErrorBtnClick = () => {},
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageHeight, setCurrentPageHeight] = useState(0);

  useEffect(() => {
    !hideFooter && createObserver();
    // Todo: Need to unobserve
  }, []);

  const createObserver = () => {
    const options = {
      root: document.getElementsByClassName('iwd-scroll-contain')[0],
      // rootMargin: '220px 0px 60px 0px',
      threshold: 0.8,
    };

    const childElems = document.getElementsByClassName('iwd-scroll-child');
    let observer = new IntersectionObserver(handleIntersect, options);
    for (let i = childElems.length; i--;) {
      observer.observe(childElems[i]);
    }
  };

  const handleIntersect = (entries) => {
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
    container.scroll({
      top: currentPage < pages ? currentPageHeight : -currentPageHeight,
      behavior: 'smooth'
    });
  };

  const Footer = (
    <div id="iwd-page-footer">
      <IconButton className="iwd-pf-btn" onClick={scrollPage}>
        <img
          src={currentPage < pages ? DownwardIcon : UpwardIcon}
          alt=""
        />
      </IconButton>
      <div id="iwd-pf-page-nos">
        <b>{currentPage}</b>|{pages}
      </div>
    </div>
  );

  return (
    <>
      <div className="iwd-scroll-contain">
        {error ?
          <ErrorScreen
            useTemplate={true}
            templateImage={IlsError}
            templateErrTitle="Oops!"
            templateErrText="Something went wrong! Please retry after some time or contact your wealth manager"
            templateBtnText="Retry"
            clickHandler={onErrorBtnClick}
          /> :
          scrollChildren
        }
      </div>
      {!hideFooter && !error && Footer}
    </>
  );
};

export default SnapScrollContainer;