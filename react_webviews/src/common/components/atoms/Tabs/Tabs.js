import React, { Children } from 'react';
import LibTabs from '@mui/material/Tabs';
import LibTab from '@mui/material/Tab';

export const Tabs = ({ children, ...props }) => {
  return (
    <LibTabs {...props}>
      {Children.map(children, (el) => {
        return React.cloneElement(el);
      })}
    </LibTabs>
  );
};

export const Tab = (props) => {
  return <LibTab {...props} />;
};
