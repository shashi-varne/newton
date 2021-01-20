import React from 'react';

export const UnSelectedRadio = () => {
  return <div className='iwd-radio-box-parent' />;
};

export const SelectedRadio = () => {
  return (
    <div className='iwd-radio-box-parent'>
      <div className='iwd-radio-box-child' />
    </div>
  );
};
