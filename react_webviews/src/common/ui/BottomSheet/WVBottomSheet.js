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
    classes={}
  >
    Place anything here that needs to be added within
    the content box of bottomsheet but not as subtitle
  </WVBottomSheet>

*/

import './WVBottomSheet.scss';
import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import Dialog, {
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';
import { Imgc } from '../Imgc';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import WVButtonLayout from '../ButtonLayout/WVButtonLayout';

const WVBottomSheet = ({
  isOpen,
  onClose, // Callback for when bottomsheet is being closed
  buttonLayout, // Sets button layout - stacked/stackedOR/horizontal [default=horizontal]
  button1Props, // Props for button 1 (type, title, onClick, classes)
  button2Props = {},// Props for button 2 (type, title, onClick, classes)
  title, // Title for bottomsheet
  subtitle, // Subtitle for bottomsheet (shows below title)
  children, // Allows for addition of any kind of content within the BottomSheet DialogContent box
  image, // Image to show on top right corner (Use require('path'))
  classes,
  ...props // Any other props to be sent to Dialog
}) => {
  return (
    <Dialog
      id="wv-bottomsheet"
      open={isOpen}
      onClose={onClose}
      className={`wv-bottomsheet ${classes.container}`}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...props}
    >
      <DialogContent>
        <div className={`wv-bottomsheet-content ${classes.content}`}>
          <div className="wv-bc-left">
            {title &&
              <div className={`wv-bcl-title ${classes.title}`}>
                {title}
              </div>
            }
            {subtitle &&
              <Subtitle className={classes.subtitle}>
                {subtitle}
              </Subtitle>
            }
          </div>
          <div className="wv-bc-right">
            {image &&
              <Imgc
                className={`wv-bcr-image ${classes.image}`}
                alt=""
                src={image}
              />
            }
          </div>
        </div>
        {children}
      </DialogContent>
      <DialogActions>
        <WVButtonLayout
          layout={buttonLayout === 'stackedOR' ? 'stacked' : buttonLayout}
          className="wv-bottomsheet-actions"
        >
          {/*
            Placed on top in a 'stacked'/'stackedOR' layout,
            left in a 'horizontal' layout
          */}
          <WVButtonLayout.Button
            title={button1Props.title}
            type={button1Props.type}
            {...button1Props}
          />
          {buttonLayout === 'stackedOR' && <WVButtonLayout.ORDivider />}
          {/*
            Placed at the bottom in a 'stacked'/'stackedOR' layout,
            right in a 'horizontal' layout
          */}
          {!isEmpty(button2Props) &&
            <WVButtonLayout.Button
              title={button2Props.title}
              type={button2Props.type}
              {...button2Props}
            />
          }
        </WVButtonLayout>
      </DialogActions>
    </Dialog>
  );
};

const Subtitle = ({ children, className }) => {
  return (
    <div className={`wv-bcl-subtitle ${className}`}>
      {children}
    </div>
  );
}

WVBottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  buttonLayout: PropTypes.oneOf(['stacked', 'stackedOR', 'horizontal']),
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node
};

WVBottomSheet.defaultProps = {
  onClose: () => {},
  buttonLayout: 'horizontal',
  button1Props: {
    type: 'primary',
  },
  classes: {},
};

WVBottomSheet.Subtitle = Subtitle;

export default WVBottomSheet;


