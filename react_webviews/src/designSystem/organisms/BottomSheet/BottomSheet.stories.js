import React, { useEffect, useState } from 'react';
import Button from '../../atoms/Button';
import BottomSheet from './BottomSheet';

export default {
  component: BottomSheet,
  title: 'Molecules/BottomSheet',
  argTypes: {
    imageTitleSrcProps: {
      control: {
        disable: true,
      },
    },
    imageLabelSrcProps: {
      control: {
        disable: true,
      },
    },
    title: {
      control: {
        type: 'text',
      },
    },
    label: {
      control: {
        type: 'text',
      },
    },
    subtitle: {
      control: {
        type: 'text',
      },
    },
  },
};

export const TwoCta = (args) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(args?.isOpen);
  }, [args?.isOpen]);
  const handleBottomSheet = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button title='Open Bottomsheet' onClick={handleBottomSheet} />
      <BottomSheet {...args} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

TwoCta.args = {
  imageTitleSrc: require('assets/amazon_pay.svg'),
  title: 'Easy Sip',
  subtitle: 'I am supposed to be a subtitle.',
  primaryBtnTitle: 'Primary',
  secondaryBtnTitle: 'Secondary',
};

export const OneCta = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleBottomSheet = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setIsOpen(args?.isOpen);
  }, [args?.isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Button title='Open Bottomsheet' onClick={handleBottomSheet} />
      <BottomSheet {...args} isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

OneCta.args = {
  imageTitleSrc: require('assets/amazon_pay.svg'),
  title: 'Easy Sip',
  subtitle: 'I am supposed to be a subtitle.',
  primaryBtnTitle: 'Primary',
};
