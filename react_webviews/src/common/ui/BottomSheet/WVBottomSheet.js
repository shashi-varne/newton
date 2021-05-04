/*

Use: Info Bubble to show informational/error/success/warning content with ability to dismiss

Example syntax:
  <WVBottomSheet
    isOpen={true} ***required***
    onClose={() => {...}}
    buttonLayout="stacked",
    button1Props={{
      type: 'primary' ***required***
      title: 'Button 1', ***required***
      onClick: () => {...}
      classes: {}
    }},
    button2Props = {... (same as button1Props)},
    title="Bottomsheet title",
    subtitle="Bottomsheet subtitle"
    image={require('assets/path/to/asset')}
  >
    Place anything here that needs to be added within
    the content box of bottomsheet but not as subtitle
  </WVBottomSheet>

*/


import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import Dialog, {
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';
import { Imgc } from '../Imgc';
import { isEmpty } from '../../../utils/validators';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

export const WVBottomSheet = ({
  isOpen,
  onClose, // Callback for when bottomsheet is being closed
  buttonLayout, // Sets button layout - stacked/stackedOR/horizontal [default=horizontal]
  button1Props, // Props for button 1 (type, title, onClick, classes)
  button2Props = {},// Props for button 2 (type, title, onClick, classes)
  title, // Title for bottomsheet
  subtitle, // Subtitle for bottomsheet (shows below title)
  children, // Allows for addition of any kind of content within the BottomSheet DialogContent box
  image // Image to show on top right corner (Use require('path'))
}) => {
  return (
    <Dialog
      id="wv-bottomsheet"
      open={isOpen}
      onClose={onClose}
      className="wv-bottomsheet"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <div className="wv-bottomsheet-content">
          <div className="wv-bc-left">
            {title &&
              <div className="wv-bcl-title">
                {title}
              </div>
            }
            {subtitle &&
              <div className="wv-bcl-subtitle">
              {subtitle}
              </div>
            }
          </div>
          <div className="wv-bc-right">
            {image &&
              <Imgc
                className="wv-bcr-image"
                alt=""
                src={image}
              />
            }
          </div>
          {children}
        </div>
      </DialogContent>
      <DialogActions>
        <div className={`wv-bottomsheet-actions wv-ba-layout-${buttonLayout}`}>
          {/*
            Placed on top in a 'stacked'/'stackedOR' layout,
            left in a 'horizontal' layout
          */}
          <BottomSheetButton
            order="1"
            type={button1Props.type}
            {...button1Props}
          />
          {buttonLayout === 'stackedOR' && <ORDivider />}
          {/*
            Placed at the bottom in a 'stacked'/'stackedOR' layout,
            right in a 'horizontal' layout
          */}
          {!isEmpty(button2Props) &&
            <BottomSheetButton
              order="2"
              type={button2Props.type}
              {...button2Props}
            />
          }
        </div>
      </DialogActions>
    </Dialog>
  );
};

const ORDivider = () => (
  <img
    src={require('assets/ORDivider.svg')}
    alt="or"
    style={{ width: '100%', margin: '10px 0' }}
  />
);

const BUTTON_TYPE_PROPS = {
  primary: {
    variant: 'raised'
  },
  secondary: {
    variant: 'outlined'
  },
  text: {}
};

const COMMON_BUTTON_PROPS = {
  fullWidth: true,
  autoFocus: true,
  size: "large",
  color: "secondary"
};

const BottomSheetButton = ({ order, title, classes = {}, type, ...props }) => {
  let modifiedClasses = {
    root: `
      wv-ba-button${order}
      wv-ba-button-${type}
      ${classes.root}
    `,
    ...classes
  };

  return (
    <Button
      {...COMMON_BUTTON_PROPS}
      {...BUTTON_TYPE_PROPS[type]}
      classes={modifiedClasses}
      onClick={props.handleClick}
    >
      {title}
    </Button>
  );
}

WVBottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  buttonLayout: PropTypes.oneOfType(['stacked', 'stackedOR', 'horizontal']),
  button1Props: PropTypes.shape({
    type: PropTypes.oneOfType(['primary', 'secondary', 'text']).isRequired,
    title: PropTypes.string.isRequired,
  }),
  button2Props: PropTypes.shape({
    type: PropTypes.oneOfType(['primary', 'secondary', 'text']).isRequired,
    title: PropTypes.string.isRequired,
  }),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

WVBottomSheet.defaultProps = {
  onClose: () => {},
  buttonLayout: 'horizontal',
  button1Props: {
    type: 'primary',
  },
};



