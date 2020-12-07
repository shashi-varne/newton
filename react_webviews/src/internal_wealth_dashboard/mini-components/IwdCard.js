// ------------------ Assets --------------------------
import IlsError from 'assets/fisdom/ils_error.svg';
// ----------------------------------------------------
import React from 'react';
import ErrorScreen from '../../common/responsive-components/ErrorScreen';
import IwdCardLoader from './IwdCardLoader';
import { CSSTransition } from 'react-transition-group';

export default function IwdCard({
  headerText = '',
  children,
  error = false,
  errorText = '',
  isLoading = false,
  className = '',
  id = '',
  style = {},
}) {
  const renderChild = () => {
    if (isLoading) {
      return <IwdCardLoader />;
    }
  
    if (error) {
      return (
        <ErrorScreen
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
    //   appear={true}
    //   in={true}
    //   classNames="example"
    //   timeout={1000}
    // >
      <div className={`iwd-card ${className} iwd-animatedFade`} id={id} style={style}>
        {headerText && <div className="iwd-card-header">{headerText}</div>}
        {renderChild()}
      </div>
    // </CSSTransition>
  );
}

