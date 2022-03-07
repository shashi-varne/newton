import React, { useEffect, useRef, useState } from 'react';
import { Dialog, IconButton, Stack } from '@mui/material';
import Typography from '../../atoms/Typography';
import scrollIntoView from 'scroll-into-view-if-needed';

import './SipDateSelector.scss';
import Button from '../../atoms/Button';
import Icon from '../../atoms/Icon';

const SipDateSelector = ({ isOpen, sipDates, onClose, selectedDate, handleSelectedDate }) => {
  const [selectedData, setSelectedDate] = useState(selectedDate);
  const itemRef = useRef();

  const handleSelectedItem = (el) => () => {
    setSelectedDate(el);
  };

  const handleClose = () => {
    setSelectedDate(selectedDate);
    onClose();
  };

  useEffect(() => {
    if (itemRef.current && isOpen) {
      const element = itemRef.current;
      scrollIntoView(element, {
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [itemRef.current, isOpen]);

  const handleSetDate = () => {
    handleSelectedDate(selectedData);
    onClose();
  };

  return (
    <Dialog
      variant='bottomsheet'
      open={isOpen}
      onClose={handleClose}
      className='sip-date-selector-sheet'
      keepMounted
      data-aid="bottomsheet_datePicker"
    >
      <Stack className='sip-date-selector-wrapper'>
        <Stack sx={{ mb: 2 }} direction='row' justifyContent='center' className='sip-title-wrapper'>
          <IconButton onClick={handleClose}>
            <Icon size='24px' src={require('assets/close_small.svg')} dataAid="close" />
          </IconButton>
          <Typography variant='heading3' align='center' dataAid="title" >
            Available dates
          </Typography>
        </Stack>
        <Stack className='selector-list-wrapper' data-aid="grp_label" >
          {sipDates?.map((el, idx) => {
            const elRef = selectedData === el ? itemRef : null;
            const selectedItemColor =
              selectedData === el ? 'primary' : 'foundationColors.content.secondary';
            const selectedVariant = selectedData === el ? 'heading3' : 'body2';
            return (
              <Stack
                direction='row'
                alignItems='center'
                spacing={2}
                ref={elRef}
                key={idx}
                className='selector-item-wrapper'
                onClick={handleSelectedItem(el)}
              >
                <Typography variant={selectedVariant} color={selectedItemColor} dataAid={`label${idx+1}`} >
                  {el}
                </Typography>
                {selectedData === el && (
                  <Typography
                    className='selected-date-text'
                    color='foundationColors.content.secondary'
                    variant='body5'
                    dataAid="info"
                  >
                    of every month
                  </Typography>
                )}
              </Stack>
            );
          })}
        </Stack>
        <Button sx={{ mt: 4 }} title='Select Date' onClick={handleSetDate} dataAid="primary" />
      </Stack>
    </Dialog>
  );
};
export default SipDateSelector;
