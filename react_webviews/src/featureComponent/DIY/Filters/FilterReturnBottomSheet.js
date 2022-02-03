import React from 'react';
import { Dialog, Stack } from '@mui/material';
import Typography from '../../../designSystem/atoms/Typography';
import Icon from '../../../designSystem/atoms/Icon';
import Button from '../../../designSystem/atoms/Button';
import isFunction from 'lodash/isFunction';

import './FilterReturnBottomSheet.scss';

export const FilterType = {
  returns: 'returns',
  sort: 'sort',
};

const FilterReturnBottomSheet = ({ variant, isOpen, handleClose, onSelect, selectedValue }) => {
  const isReturn = FilterType?.returns === variant;
  const title = isReturn ? 'Returns' : 'Sort';
  const handleSelection = (item) => {
    if (isFunction(onSelect)) {
      onSelect(item);
    }
  };

  return (
    <div className='filter-return-wrapper'>
      <Dialog PaperProps={{elevation: '1'}} forcedbottomsheet={1} disablePortal open={isOpen} onClose={handleClose} variant='bottomsheet'>
        <Stack sx={{ p: 2 }}>
          <Stack direction='row' className='fr-title-wrapper'>
            <Icon size='24px' src={require('assets/amazon_pay.svg')} />
            <Typography sx={{ height: '' }} align='center'>
              {title}
            </Typography>
          </Stack>
          {isReturn ? (
            <Return selectedValue={selectedValue} handleSelection={handleSelection} />
          ) : (
            <Sorting selectedValue={selectedValue} handleSelection={handleSelection} />
          )}

          <Button title='Apply' sx={{ mt: '74px' }} />
        </Stack>
      </Dialog>
    </div>
  );
};

export default FilterReturnBottomSheet;

const Sorting = ({ selectedValue, handleSelection }) => {
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
                variant={selectedValue === item?.value ? 'heading4' : 'body8'}
                color='foundationColors.content.secondary'
              >
                {item.label2}
              </Typography>
              {selectedValue === item?.value && (
                <Icon size='24px' src={require('assets/amazon_pay.svg')} />
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

const Return = ({ selectedValue, handleSelection }) => {
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
              variant={selectedValue === item?.value ? 'heading4' : 'body8'}
              color='foundationColors.content.secondary'
            >
              {item.label}
            </Typography>
            {selectedValue === item?.value && (
              <Icon size='24px' src={require('assets/amazon_pay.svg')} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export const ReturnsDataList = [
  { id: 1, label: '1 Month', value: '1M' },
  { id: 2, label: '3 Months', value: '3M' },
  { id: 3, label: '6 Months', value: '6M' },
  { id: 4, label: '1 Year', value: '1Y' },
  { id: 5, label: '3 Years', value: '3Y' },
  { id: 6, label: '5 Years', value: '5Y' },
];

export const SortsDataList = [
  { id: 1, label1: 'Returns', label2: 'High to low', value: 'returnsHTL' },
  { id: 2, label1: 'Fund size (AUM)', label2: 'High to low', value: 'fundSizeHTL' },
  { id: 3, label1: 'Expense ratio', label2: 'Low to high', value: 'expenseRatioLTH' },
  { id: 4, label1: 'Rating', label2: 'High to low', value: 'ratingHTL' },
];
