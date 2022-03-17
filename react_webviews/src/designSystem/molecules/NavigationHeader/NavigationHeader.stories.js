import React, { useRef, useState } from 'react';
import { NavigationHeader, NavigationHeaderPoints, NavigationHeaderSubtitle } from '.';
import Typography from '../../atoms/Typography';

export default {
  component: NavigationHeader,
  title: 'Molecules/NavigationHeader',
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = (args) => {
  const wrapperRef = useRef();
  const [value, setValue] = useState(0);
  const handleTabs = (e, val) => {
    setValue(val);
  };
  return (
    <div ref={wrapperRef} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <NavigationHeader
        {...args}
        anchorOrigin={wrapperRef}
        tabsProps={{
          onTabChange: handleTabs,
          selectedTab: value,
        }}
      >
        <NavigationHeaderSubtitle>
          These funds invest 80% of their assets in top 100 blue-chip companies of India with a
          market cap of over ₹30,000 cr
        </NavigationHeaderSubtitle>
        <NavigationHeaderPoints>
          Offers stability & multi-sector diversification
        </NavigationHeaderPoints>
        <NavigationHeaderPoints>
          Ideal for long-term investors seeking stabilit
        </NavigationHeaderPoints>
      </NavigationHeader>
      <main style={{ padding: '0px 16px', backgroundColor: 'lightcyan' }}>
        <Typography variant='body3'>Some Screen Content</Typography>
        <div style={{ height: '150vh' }}></div>
      </main>
    </div>
  );
};

export const Default = Template.bind({});

const tabsData = [
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
  {
    label: 'Label',
  },
];

Default.args = {
  headerTitle: 'Large Cap',
  rightIconSrc: require('assets/amazon_pay.svg'),
  tabChilds: tabsData,
};

Default.argTypes = {
  actionTextProps: {
    control: {
      disable: true,
    },
  },
  children: {
    control: {
      disable: true,
    },
  },
  tabsProps: {
    control: {
      disable: true,
    },
  },
};

export const WithActionText = Template.bind({});


WithActionText.args = {
    headerTitle: 'Large Cap',
    actionTextProps: {
        title: 'Skip'
    },
  };