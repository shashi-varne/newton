import React, { Fragment, useState } from 'react';
import { getConfig } from 'utils/functions';
import Tooltip from 'common/ui/Tooltip';
import { Dialog } from 'material-ui';
const isMobileView = getConfig().isMobileDevice;

export default function WrTooltip(props) {
  const {
    trigger = '', // allows for a trigger element for the tooltip/dialog
    tipContent = '', // tooltip content
    tooltipClass = '', // classes for tooltip (not dialog)
    tooltipDirection = 'down', // directiopn to open tooltip
    forceDirection = false, // tells the tip to allow itself to render out of view if there's not room for the specified direction. If undefined or false, the tip will change direction as needed to render within the confines of the window.
    onClickAway = () => {}, // Used for tooltip, callback for ClickAwayListener
    openOnClick, // allows for tooltip to be opened/closed only on click
  } = props;
  const [openModal, toggleModal] = useState(false);

  const i_btn = (info) => (
    <span style={{ marginLeft: "6px" }}>
      <img
        src={require(`assets/fisdom/${info}.svg`)}
        width={12}
        id="wr-i-btn"
        alt=""
      />
    </span>
  );


  if (!isMobileView) {
    return (
      <Tooltip
        content={tipContent}
        isOpen={openOnClick ? openModal : undefined}
        useHover={!openOnClick}
        direction={tooltipDirection}
        forceDirection={forceDirection}
        onClickAway={(event) => onClickAway(event, toggleModal)}
        className={tooltipClass}>
        <span onClick={() => toggleModal(!openModal)}>
          { trigger || i_btn('ic-info')}
        </span>
      </Tooltip>
    );
  }

  return (
    <Fragment>
      <span onClick={() => toggleModal(!openModal)}>
        {trigger || i_btn('ic-info')}
      </span>
      <Dialog
        open={openModal}
        onClose={() => toggleModal(false)}
        classes={{ paper: "wr-dialog-info" }}
      >
        {tipContent}
      </Dialog>
    </Fragment> 
  );
}