import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import React, { memo, useState } from 'react';
import Separator from '../Separator';
import Typography from '../Typography';
import subIcon from 'assets/sub_icon.svg';
import addIcon from 'assets/add_icon.svg';
import PropTypes from 'prop-types';
import Icon from '../Icon';

import './Faq.scss';

const Faq = ({ options, selectedValue, expandedIcon, collapsedIcon, dataAid }) => {
  const [isExpanded, setIsExpanded] = useState(selectedValue);

  const handleFaqs = (val) => {
    if (val === isExpanded) {
      setIsExpanded(null);
    } else {
      setIsExpanded(val);
    }
  };

  return (
    <div className='faq-accordian-wrapper' data-aid={`FAQ_${dataAid}`}>
      {options?.map((el, idx) => {
        const subtitleColor = el?.subtitleColor || 'foundationColors.content.secondary';
        return (
          <div
            key={idx}
            data-aid={`FAQ_${el?.value === isExpanded ? 'expand' : `collapsed${idx+1}`}`}
            className={`faq-accordian-item ${el?.disabled && 'faq-acc-disabled'}`}
          >
            <Accordion
              sx={accordianSxStyle}
              disabled={el?.disabled}
              expanded={el?.value === isExpanded}
              onChange={() => handleFaqs(el?.value)}
              square
            >
              <AccordionSummary sx={summaryAccordianSxStyle}>
                <div className='faq-title-wrapper'>
                  <Typography
                    variant='body1'
                    dataAid='title'
                    color={el?.titleColor}
                    component='div'
                  >
                    {el?.title}
                  </Typography>
                  <Icon src={el?.value === isExpanded ? expandedIcon : collapsedIcon} size='24px' />
                </div>
              </AccordionSummary>
              <AccordionDetails sx={detailsAccordianSxStyle}>
                <Typography
                  variant='body2'
                  color={subtitleColor}
                  dataAid='subtitle'
                  component='div'
                >
                  {el?.subtitle}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

Faq.defaultProps = {
  expandedIcon: subIcon,
  collapsedIcon: addIcon,
  options: [],
};

Faq.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.exact({
      title: PropTypes.string,
      titleColor: PropTypes.string,
      subtitle: PropTypes.node,
      subtitleColor: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      disabled: PropTypes.bool,
    })
  ).isRequired,
};

const detailsAccordianSxStyle = {
  padding: '0px 0px 16px 0px',
};

const accordianSxStyle = {
  background: 'transparent !important',
  boxShadow: 'none !important',
  '&.Mui-expanded': {
    margin: '0px 0px 16px 0px',
  },
};

const summaryAccordianSxStyle = {
  padding: '0px',
  minHeight: '24px !important',
  '& .MuiAccordionSummary-content': {
    margin: '0px 0px',
    '&.Mui-expanded': {
      margin: '0px 0px',
    },
  },
};

export default memo(Faq);
