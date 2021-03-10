import React from 'react'
import Dialog, { DialogContent } from "material-ui/Dialog";
import { Imgc } from "common/ui/Imgc";

const KnowMore = ({ isOpen }) => {
  return (
    <Dialog
      open={isOpen}
      aria-labelledby="ipv-know-dialog"
      keepMounted
      aria-describedby="ipv-know-dialog"
      className="ipv-know-dialog"
      id="ipv-know-dialog"
    >
      <DialogContent className="know_more_dialog">
        <h1>adskjhasjkds</h1>
      </DialogContent>
    </Dialog>
  );
}

export default KnowMore