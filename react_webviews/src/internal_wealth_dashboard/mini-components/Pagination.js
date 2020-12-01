import React from 'react';

const Pagination = ({ per_page, totalCount, more, nextPage }) => {
  const pageNumbers = Math.ceil(totalCount / per_page);

  const renderPageNumbers = () => {
    if (totalCount) {
      return [...Array(pageNumbers)]?.map((el, idx) => (
        <div key={idx} className='iwd-pagination-box' onClick={nextPage}>
          {idx + 1}
        </div>
      ));
    }
  };
  return (
    <div className='iwd-pagination-container'>
      <div className='iwd-pagination-box'>&laquo;</div>
      <div className='iwd-page-number-container'>{renderPageNumbers()}</div>
      <div className='iwd-pagination-box'>&raquo;</div>
    </div>
  );
};

export default Pagination;
