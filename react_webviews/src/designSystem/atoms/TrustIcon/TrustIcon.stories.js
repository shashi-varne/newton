import React from "react";
import TrustIcon from "./TrustIcon";

export default {
  component: TrustIcon,
  title: 'Atoms/TrustIcon',
  argTypes: {
    variant: {
      options: ['emandate','secure','contact','registration'],
      control: {
        type: 'radio'
      }
    }
  }
}

export const Default = args => <TrustIcon {...args} />