import React from 'react';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import './AmountUpdateDialog.scss';

const AmountUpdateDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  fundName,
  fundMinPurchase,
}) => {
  return (
    <div>
      <WVBottomSheet
        isOpen={isOpen}
        buttonLayout='horizontal'
        button1Props={{
          type: 'primary',
          title: 'Confirm',
          onClick: onConfirm,
        }}
        button2Props={{
          title: 'Cancel',
          onClick: onCancel,
        }}
        classes={{
          content: 'custom-content-class',
        }}
        title={`Minimum investment amount for ${fundName} fund is Rs ${fundMinPurchase}.`}
        subtitle='Your fund allocations will be modified accordingly.'
      ></WVBottomSheet>
    </div>
  );
};

export default AmountUpdateDialog;
