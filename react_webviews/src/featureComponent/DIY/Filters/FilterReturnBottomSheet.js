import React, { useState } from 'react';
import { Dialog, IconButton, Stack } from '@mui/material';
import Typography from '../../../designSystem/atoms/Typography';
import Icon from '../../../designSystem/atoms/Icon';
import Button from '../../../designSystem/atoms/Button';

import './FilterReturnBottomSheet.scss';

export const FilterType = {
  returns: 'returns',
  sort: 'sort',
};

const FilterReturnBottomSheet = ({ variant, isOpen, handleClose, applyFilter, selectedValue }) => {
  const [selectedItem, setSelectedItem] = useState(selectedValue);
  const isReturn = FilterType?.returns === variant;
  const title = isReturn ? 'Returns' : 'Sort';

  const handleSelection = (item) => {
    setSelectedItem(item);
  };

  const onSelect = () => {
    applyFilter(selectedItem);
    handleClose();
  };

  const onClose = (e) => {
    setSelectedItem(selectedValue);
    handleClose(e);
  };

  return (
    <div className='filter-return-wrapper'>
      <Dialog
        PaperProps={{ elevation: 1 }}
        forcedbottomsheet={1}
        disablePortal
        open={isOpen}
        onClose={onClose}
        variant='bottomsheet'
      >
        <Stack sx={{ p: 2 }}>
          <Stack direction='row' justifyContent='center' className='fr-title-wrapper'>
            <IconButton onClick={handleClose}>
              <Icon size='24px' src={require('assets/close_small.svg')} />
            </IconButton>
            <Typography variant='heading3' align='center'>
              {title}
            </Typography>
          </Stack>
          {isReturn ? (
            <Return selectedItem={selectedItem} handleSelection={handleSelection} />
          ) : (
            <Sorting selectedItem={selectedItem} handleSelection={handleSelection} />
          )}

          <Button title='Apply' sx={{ mt: '74px' }} onClick={onSelect} />
        </Stack>
      </Dialog>
    </div>
  );
};

export default FilterReturnBottomSheet;

const Sorting = ({ selectedItem, handleSelection }) => {
  return (
    <Stack sx={{ mt: 2 }} spacing={2}>
      {SortsDataList?.map((item, idx) => {
        return (
          <Stack spacing='4px' direction='column' key={idx} onClick={() => handleSelection(item)}>
            <Typography variant='body2' color='foundationColors.content.tertiary'>
              {item?.label1}
            </Typography>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
              <Typography
                variant={selectedItem?.value === item?.value ? 'heading4' : 'body8'}
                color='foundationColors.content.secondary'
              >
                {item.label2}
              </Typography>
              {selectedItem?.value === item?.value && (
                <Icon size='24px' src={require('assets/checked.svg')} />
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

const Return = ({ selectedItem, handleSelection }) => {
  return (
    <Stack sx={{ mt: 2 }} spacing={3}>
      {ReturnsDataList?.map((item, idx) => {
        return (
          <Stack
            direction='row'
            key={idx}
            onClick={() => handleSelection(item)}
            justifyContent='space-between'
            alignItems='center'
          >
            <Typography
              variant={selectedItem?.value === item?.value ? 'heading4' : 'body8'}
              color='foundationColors.content.secondary'
            >
              {item.label}
            </Typography>
            {selectedItem?.value === item?.value && (
              <Icon size='24px' src={require('assets/checked.svg')} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export const ReturnsDataList = [
  { label: '1 Month', value: 'one_month_return', returnLabel: '1M' },
  { label: '3 Months', value: 'three_month_return', returnLabel: '3M' },
  { label: '6 Months', value: 'six_month_return', returnLabel: '6M' },
  { label: '1 Year', value: 'one_year_return', returnLabel: '1Y' },
  { label: '3 Years', value: 'three_year_return', returnLabel: '3Y' },
  { label: '5 Years', value: 'five_year_return', returnLabel: '5Y' },
];

export const SortsDataList = [
  { label1: 'Returns', label2: 'High to low', value: 'returns', order: 'desc' },
  { label1: 'Fund size (AUM)', label2: 'High to low', value: 'aum', order: 'desc' },
  { label1: 'Expense ratio', label2: 'Low to high', value: 'expense_ratio', order: 'asc' },
  { label1: 'Rating', label2: 'High to low', value: 'morning_star_rating', order: 'desc' },
];
