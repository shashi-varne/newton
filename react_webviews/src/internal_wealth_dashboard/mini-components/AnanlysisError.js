import React from 'react';
import ErrorIcon from '../../assets/fisdom/ils_error@2x.svg';

function AnalysisError({
  header = 'Top Stocks in portfolio',
  message = 'Something went wrong! Please retry after some time or contact your wealth manager',
}) {
  return (
    <div className="iwd-p-scroll-child">
      <div className="iwd-card iwd-card-margin">
        <h2 className="iwd-card-header">{header}</h2>
        <section className="iwd-analysis-error-container">
          <picture>
            <img
              className="iwd-analysis-error-image"
              src={ErrorIcon}
              alt="Error Icon"
            />
          </picture>
          <article className="iwd-analysis-error-description">
            {message}
          </article>
        </section>
      </div>
    </div>
  );
}

export default AnalysisError;
