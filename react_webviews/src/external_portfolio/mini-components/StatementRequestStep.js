import React from 'react';
import { getConfig } from '../../utils/functions';

const { productName } = getConfig();

const CheckIcon = (
  <img
    alt="external_portfolio"
    src={require(`assets/${productName}/step_complete_check_icn.svg`)}
  />
);

export default function StatementRequestStep({
  stepNumber,
  isCompleted,
  children,
}) {
  return (
    <div className='statement-request-step'>
      <div className='statement-request-step-number'>
        {isCompleted
          ? CheckIcon
          : stepNumber
        }
      </div>
      {children}
    </div>
  );
}

const Title = ({ children }) => (
  <div className='statement-request-step-title'>
    {children}
  </div>
);

StatementRequestStep.Title = Title;

const Content = ({ children }) => (
  <div className='statement-request-step-content'>
    {children}
  </div>
);

StatementRequestStep.Content = Content;