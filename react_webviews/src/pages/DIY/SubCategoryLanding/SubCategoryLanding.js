import { Box } from '@mui/material';
import React, { useState } from 'react';
import Typography from '../../../designSystem/atoms/Typography';
import Container from '../../../designSystem/organisms/Container';
import SwipeableViews from 'react-swipeable-views';
import { largeCap, midCap, multiCap, smallCap } from './constants';

const tabChilds = [
  {
    label: 'Large cap',
    data: largeCap,
  },
  {
    label: 'Multi cap',
    data: multiCap,
  },
  {
    label: 'Mid cap',
    data: midCap,
  },
  {
    label: 'Small cap',
    data: smallCap,
  },
];

const SubCategoryLanding = () => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e, value) => {
    setTabValue(value);
  };
  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  return (
    <Container
      headerProps={{
        headerTitle: 'Large cap',
        subtitle:
          'These funds invest 80% of their assets in top 100 blue-chip companies of India with a market cap of over ₹30,000 cr',
        points: [
          'Offers stability & multi-sector diversification',
          'Ideal for long-term investors seeking stability See less',
        ],
        tabsProps: {
          selectedTab: tabValue,
          onTabChange: handleTabChange,
        },
        tabChilds,
      }}
    >
      <SwipeableViews
        // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tabValue}
        onChangeIndex={handleChangeIndex}
        style={{
          minHeight: '100vh',
          background: 'red',
        }}
      >
        {tabChilds?.map((el, idx) => {
          return (
            <TabPanel key={idx} value={tabValue} index={idx}>
              {el?.data?.slice(0, 20)?.map((fund, idx) => {
                return <Typography key={idx} sx={{mb:'20px'}}>{fund?.legal_name}</Typography>;
              })}
            </TabPanel>
          );
        })}
      </SwipeableViews>
    </Container>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component='div'>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default SubCategoryLanding;
