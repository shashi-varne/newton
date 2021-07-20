import React from "react";
import Dialog, { DialogContent } from "material-ui/Dialog";

const DialogContainer = (props) => {
  const {component} = props;
  const Component = component;
  return (
    <Dialog
      open={props.isOpen}
      onClose={() => {}}
      aria-labelledby="kyc-dialog"
      keepMounted
      aria-describedby="kyc-dialog"
      className="account-merge-dialog"
      id="kyc-bottom-dialog"
    >
      <DialogContent className="account-merge-dialog-content">
        <Component {...props}/>
      </DialogContent>
    </Dialog>
  );
};

export default DialogContainer;
