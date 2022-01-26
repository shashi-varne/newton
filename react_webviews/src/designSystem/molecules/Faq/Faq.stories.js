import React from 'react';
import Faq from './Faq';

export default {
  component: Faq,
  title: 'Molecules/Faq',
};

export const Default = (args) => <Faq {...args} />;

const Options = [
  {
    title: 'What is easySIP?',
    subtitle:
      'To put it simply, easySIP is the name we have given to the payment method you use to pay for your monthly SIP payments. It is just an evolved version of the post-dated cheques that you must have used to make automatic SIP payments. It is completely paperless and secured by NPCI which is the PSU behind Rupay and UPI.',
    value: 'one',
  },
  {
    title: 'Why do I need to give authorization to take money from my bank account?',
    subtitle: 'Some subtitle over here',
    value: 'three',
  },
  {
    title: 'Why is e-Mandate maximum amount 50,000/- when my SIP is of less amount?',
    subtitle: 'I am some other subtitle over here',
    value: 'four',
  },
];

Default.args = {
  options: Options,
  selectedValue: 'one',
};
