import React from 'react';
import 'react-circular-progressbar/dist/styles.css';
import Dialog, {
  DialogContent,
  DialogActions
} from 'material-ui/Dialog';
import { Imgc } from '../Imgc';
import { isEmpty } from '../../../utils/validators';
import { Button } from '@material-ui/core';

export const WVBottomSheet = ({
  isOpen,
  onClose,
  buttonLayout,
  button1Props,
  button2Props = {},
  title,
  content,
  image
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
            {content &&
              <div className="wv-bcl-desc">
                {content}
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
        </div>
      </DialogContent>
      <DialogActions>
        <div className={`wv-bottomsheet-actions wv-ba-layout-${buttonLayout}`}>
          <BottomSheetButton
            order="1"
            type={button1Props.type}
            {...button1Props}
          />
          {buttonLayout === 'stackedOR' && <ORDivider />}
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



