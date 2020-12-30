import { ButtonBase } from 'material-ui';
import React from 'react';
// import { CSSTransition } from 'react-transition-group';
import IwdErrorScreen from '../mini-components/IwdErrorScreen';
import IwdCardLoader from './IwdCardLoader';

export default function IwdCard({
  headerText = '',
  children,
  error = false,
  errorText = '',
  noData = false,
  noDataText = '',
  isLoading = false,
  className = '',
  id = '',
  style = {},
  onClick = () => {},
  isClickable = false,
  animate = true,
  animation = ''
}) {
  const renderChild = () => {
    if (isLoading) {
      return <IwdCardLoader />;
    }
  
    if (error) {
      return (
        <IwdErrorScreen
          hasError={true}
          templateErrText={errorText}
        />
      )
    }

    if (noData) {
      return (
        <IwdErrorScreen
          hasNoData={true}
          templateErrText={
            noDataText ||
            "No data found"
          }
        />
      );
    }

    return children;
  };

  if (isClickable) {
    return (
      <ButtonBase classes={{ root: `iwd-card ${className} iwd-animatedFade` }}>
        <div id={id} style={style} onClick={onClick}>
          {headerText && <div className="iwd-card-header">{headerText}</div>}
          {renderChild()}
        </div>
      </ButtonBase>
    );
  }

  return (
    // <CSSTransition
    //   in={!error && !isLoading}
    //   classNames="iwd-card-data-animate"
    //   timeout={20000}
    //   // To animate card content
    // >
    <div className={`iwd-card ${className} ${animate ? animation || 'iwd-animatedFade' : ''}`} id={id} style={style} onClick={onClick}>
      {headerText && <div className="iwd-card-header">{headerText}</div>}
      {renderChild()}
    </div>
    // </CSSTransition>
  );
}

