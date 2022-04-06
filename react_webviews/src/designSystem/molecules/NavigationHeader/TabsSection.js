import React from 'react';
import { Tab, Tabs } from '../../atoms/Tabs/Tabs';

const TabsSection = ({ tabs, tabChilds }) => {
  const { selectedTab = 0, onTabChange, labelName = 'label', ...restTabs } = tabs;
  return (
    <Tabs value={selectedTab} onChange={onTabChange} {...restTabs}>
      {tabChilds?.map((el, idx) => {
        const value = el?.value || idx;
        return <Tab disableRipple={true} key={idx} label={el[labelName]} value={value} {...el} />;
      })}
    </Tabs>
  );
};

export default TabsSection;
