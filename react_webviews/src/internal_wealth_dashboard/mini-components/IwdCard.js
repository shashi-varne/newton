// ------------------ Assets --------------------------
import IlsError from 'assets/fisdom/ils_error.svg';
// ----------------------------------------------------
import React from 'react';
// import { CSSTransition } from 'react-transition-group';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
import IwdCardLoader from './IwdCardLoader';

export default function IwdCard({
  headerText = '',
  children,
  error = false,
  errorText = '',
  isLoading = false,
  className = '',
  id = '',
  style = {},
  onClick = () => {},
}) {
  const renderChild = () => {
    if (isLoading) {
      return <IwdCardLoader />;
    }
  
    if (error) {
      return (
        <ErrorScreen
          classes={{
            container: 'iwd-fade'
          }}
          useTemplate={true}
          templateImage={IlsError}
          templateErrText={errorText}
        />
      )
    }

    return children;
  };

  return (
    // <CSSTransition
    //   in={!error && !isLoading}
    //   classNames="iwd-card-data-animate"
    //   timeout={20000}
    //   // To animate card content
    // >
      <div className={`iwd-card ${className} iwd-animatedFade`} id={id} style={style} onClick={onClick}>
        {headerText && <div className="iwd-card-header">{headerText}</div>}
        {renderChild()}
      </div>
    // </CSSTransition>
  );
}

