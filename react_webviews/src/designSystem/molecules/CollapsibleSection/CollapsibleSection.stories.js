import React, { useEffect, useState } from 'react';
import CollapsibleSection from './CollapsibleSection';

export default {
  component: CollapsibleSection,
  title: 'Molecules/CollapsibleSection',
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  argTypes: {
    isOpen: {
      defaultValue: false,
    },
    children: {
      control: {
        disable: true,
      },
    },
    childWrapperClass: {
      control: {
        disable: true,
      },
    },
  },
};

export const Default = (args) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(args?.isOpen);
  }, [args?.isOpen]);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <CollapsibleSection {...args} isOpen={open} onClick={handleClick}>
      <h1>You can see me now</h1>
    </CollapsibleSection>
  );
};

Default.args = {
  label: 'I am label',
  labelColor: 'foundationColors.content.primary',
  isOpen: false,
  expandedIcon: require('assets/amazon_pay.svg'),
  collapsedIcon: require('assets/alert_icon.svg'),
};
