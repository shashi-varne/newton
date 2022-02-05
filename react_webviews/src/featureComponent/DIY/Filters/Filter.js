import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Drawer, Stack } from '@mui/material';

import './FilterReturnBottomSheet.scss';
import NavigationHeader from '../../../designSystem/molecules/NavigationHeader';

import Button from '../../../designSystem/atoms/Button';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import FundOptions from './FundOptions';
import FundHouses from './FundHouses';

const filterOptions = ['Fund houses', 'Fund options', 'Minimum investment'];

const Filter = ({ isOpen, handleFilterClose }) => {
  const [selectedTab, setSelectedTab] = React.useState(0);

  const handleSelection = (index) => () => {
    console.log('hello', index);
    if (index !== selectedTab) {
      setSelectedTab(index);
    }
  };
  return (
    <Box className='diy-filter-wrapper'>
      <Drawer
        transitionDuration={250}
        PaperProps={{ elevation: 1 }}
        disablePortal
        variant='temporary'
        open={isOpen}
        anchor='bottom'
        onClose={handleFilterClose}
        disableScrollLock={false}
      >
        <NavigationHeader
          showCloseIcon
          headerTitle='Filters'
          hideInPageTitle
          actionTextProps={{ title: 'Clear all' }}
          onLeftIconClick={handleFilterClose}
        />
        <Stack sx={{ height: '100vh' }} justifyContent='space-between' direction='column'>
          <Stack direction='row' flexBasis='90%'>
            <LeftPanel selectedTab={selectedTab} handleSelection={handleSelection} />
            <RightPanel selectedTab={selectedTab} />
          </Stack>
          <div className='diy-filter-footer-btn-wrapper'>
            <Button title='Apply' />
          </div>
        </Stack>
      </Drawer>
    </Box>
  );
};

const LeftPanel = ({ selectedTab, handleSelection }) => {
  return (
    <Stack
      direction='column'
      flexBasis='30%'
      sx={{ backgroundColor: 'foundationColors.supporting.grey', cursor: 'pointer' }}
    >
      {filterOptions?.map((el, idx) => {
        const selectedValue = selectedTab === idx;
        const selectedColor = selectedValue
          ? 'foundationColors.content.primary'
          : 'foundationColors.content.tertiary';
        return (
          <Typography
            variant='body1'
            key={idx}
            color={selectedColor}
            sx={{ p: '16px 24px' }}
            onClick={handleSelection(idx)}
          >
            {el}
          </Typography>
        );
      })}
    </Stack>
  );
};

const RightPanel = ({ selectedTab }) => {
  return (
    <TransitionGroup className='right-panel-wrapper'>
      <Stack flexBasis='70%'>
        {selectedTab === 0 && (
          <CSSTransition in={selectedTab === 0} timeout={225} classNames='right-panel-transition'>
            <FundHouses />
          </CSSTransition>
        )}
        {selectedTab === 1 && (
          <CSSTransition in={selectedTab === 1} timeout={225} classNames='right-panel-transition'>
            <FundOptions />
          </CSSTransition>
        )}
        {selectedTab === 2 && (
          <CSSTransition in={selectedTab === 2} timeout={225} classNames='right-panel-transition'>
            <MinimumInvestment />
          </CSSTransition>
        )}
      </Stack>
    </TransitionGroup>
  );
};

const MinimumInvestment = () => {
  return <Typography variant='heading2'>MinimumInvestment</Typography>;
};

export default Filter;
