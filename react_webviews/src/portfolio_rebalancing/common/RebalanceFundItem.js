import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';

import Remove from '@material-ui/icons/Remove';

import Checkbox from '@material-ui/core/Checkbox';

import Chip from '@material-ui/core/Chip';

import infoIcon from 'assets/info_icon.svg';

import './Style.scss';

import Typography from '@material-ui/core/Typography';

import { Checked, UnChecked } from '../common/SvgContainer';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import Divider from '@material-ui/core/Divider';

import { storageService } from 'utils/validators';

import Fade from '@material-ui/core/Fade';

import { navigate } from './commonFunction';
import { getConfig } from 'utils/functions';
import { withRouter } from 'react-router-dom';

const SvgIcon = () => {
  return (
    <svg width='8' height='72' viewBox='0 0 8 72' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M4 1V70' stroke='#767E86' strokeLinecap='round' strokeDasharray='2 2' />

      <path
        d='M1.33549 67.6293C1.13073 67.444 0.814546 67.4598 0.629261 67.6645C0.443976 67.8693 0.459758 68.1855 0.664512 68.3707L1.33549 67.6293ZM4 70.7148L3.66451 71.0855C3.85497 71.2578 4.14503 71.2578 4.33549 71.0855L4 70.7148ZM7.33549 68.3707C7.54024 68.1855 7.55602 67.8693 7.37074 67.6645C7.18545 67.4598 6.86927 67.444 6.66451 67.6293L7.33549 68.3707ZM0.664512 68.3707L3.66451 71.0855L4.33549 70.344L1.33549 67.6293L0.664512 68.3707ZM4.33549 71.0855L7.33549 68.3707L6.66451 67.6293L3.66451 70.344L4.33549 71.0855Z'
        fill='#767E86'
      />
    </svg>
  );
};

// const tool_tip = {

//   marginRight: '3px',

// };

const RebalanceFundItem = ({ classes, data, onCheck, ...props }) => {
  const [checked, setChecked] = useState(false);

  const [toolTip, settoolTip] = useState(false);

  const [states, setStates] = useState([]);
  const color = getConfig().primary;

  // const sips = storageService().getObject('sip') || [];

  // const corpus = storageService().getObject('corpus') || [];

  // const sip_corpus = storageService().getObject('sip_corpus') || [];

  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const arr = storageService().getObject('checked_funds');

    console.log('use effect of item');

    // setStates([...sips, ...corpus, ...sip_corpus]);

    //const arr = states.length > 0 && [...sips, ...corpus, ...sip_corpus];

    if (arr?.length > 0) {
      const check = arr.find((el) => el.id === data.id);

      console.log(check);

      if (check) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    } else {
      setChecked(true);
    }
  }, []);

  const handleCheckbox = (data) => {
    const arr = storageService().getObject('checked_funds');

    console.log(arr);

    const check = arr.find((el) => el.id === data.id);

    console.log(check);

    if (check) {
      setChecked(false);

      const newData = arr.filter((el) => el.id !== data.id);

      storageService().setObject('checked_funds', newData);

      //setStates(newData);

      onCheck(newData);
    } else {
      setChecked(true);

      const newData = [...arr, data];

      storageService().setObject('checked_funds', newData);

      //setStates(newData);

      onCheck(newData);
    }
  };

  const handleChange = (e) => {
    handleCheckbox(JSON.parse(e.target.value));

    // const arr = storageService().getObject('selected_funds');

    // const check = arr.find((el) => el.isins === data.isin);

    console.log('check is ', JSON.parse(e.target.value));

    // if (check) {

    //   setChecked(false);

    // } else {

    //   setChecked(true);

    // }

    // onCheck(parseInt(e.target.value));
  };

  return (
    <div className='rebalance-fund-item'>
      {data && (
        <>
          <section className='switch-folio-container flex'>
            <div className='fund-select-checkbox flex float-left'>
              <Checkbox
                className='checkbox'
                checked={checked}
                value={JSON.stringify(data)}
                style={{ color }}
                onChange={handleChange}
                icon={<UnChecked size='15' borderColor={color} />}
                checkedIcon={<Checked size='15' color={color} borderColor={color} />}
                disableRipple
              />
            </div>

            <div className='switch-badge flex float-right'>
              <p className='folio-number-text'>Folio: {data.folio_number || 1234567890}</p>

              <div className='flex'>
                <Chip className='badge' label={` ${data.name.toUpperCase()} SWITCH `} />

                <div className='fund-type-tooltip'>
                  <img
                    src={infoIcon}
                    className='info-tip'
                    alt='info'
                    onClick={() => settoolTip(!toolTip)}
                  />

                  <Fade in={toolTip}>
                    <div className={`fund-type-info ${toolTip && 'show-tooltip'}`}>
                      {!data.sip_only && !data.is_sip && (
                        <>
                          <span className='fund-type-head'>Corpus switch</span>

                          <span>
                            : Redeem the money invested in low performing fund & re-invest in a
                            better fund
                          </span>
                        </>
                      )}

                      {data.sip_only && (
                        <>
                          <span className='fund-type-head'>Sip switch</span>

                          <span>
                            : Redeem accumulated investments from risky low performing funds to
                            recommended funds
                          </span>
                        </>
                      )}

                      {!data.sip_only && data.is_sip && (
                        <>
                          <span className='fund-type-head'>SIP Corpus switch</span>

                          <span>
                            : Shift both low performing corpus and SIP to the recommended funds
                          </span>
                        </>
                      )}
                    </div>
                  </Fade>
                </div>
              </div>
            </div>
          </section>

          <section className='fund-detail-container flex'>
            <div className='image-container from-fund  float-left'>
              <img src={data.mf.amc_logo_big} className='fund-image' alt='hello' />
            </div>

            <div className='fund-container float-right flex'>
              <div>
                <Typography className='fund-title'>{data.mf.friendly_name}</Typography>

                <Typography className='fund-status flex'>
                  Expert outlook: <span style={{ color: 'tomato' }}>Negative</span>
                </Typography>
              </div>

              <div
                style={{ cursor: 'pointer', zIndex: '1' }}
                onClick={() => {
                  console.log(open);

                  setOpen(!open);
                }}
              >
                {open ? <Remove /> : <AddIcon />}
              </div>
            </div>
          </section>

          <section className={`arrow-container flex ${open && 'expand-arrow'}`}>
            <div className='image-container  arrow float-left arrow'>
              <div className='arrow-image' />

              <span className='bigger-arrow'>
                <SvgIcon />
              </span>
            </div>

            <div className='sip-amount-details float-right'>
              <Fade in={open} timeout={350}>
                <div>
                  <Typography className='sip-amount-text'>Amount</Typography>

                  <Typography className='sim-amount-num'>{data.amount}</Typography>
                </div>
              </Fade>
            </div>
          </section>

          <div className='flex'>
            <div
              className='float-left'
              style={{ width: '30px', height: '10px', marginBottom: '8px' }}
            />

            <Typography className='recommended-text'>
              {'Recommended fund'.toUpperCase()}{' '}
            </Typography>
          </div>

          <section className='fund-detail-container flex'>
            <div className='image-container from-fund float-left'>
              <img src={data.recommended_mf.amc_logo_big} className='fund-image' alt='hello' />
            </div>

            <div className='fund-container float-right flex'>
              <div>
                <h4 className='fund-title'>{data.recommended_mf.friendly_name}</h4>

                <p className='fund-status flex'>
                  Expert outlook: <span style={{ color: '#35CB5D' }}> Positive</span>
                </p>
              </div>

              <div onClick={() => navigate(props, '/w-report/login', null, 1)}>
                <KeyboardArrowRightIcon style={{ color: '#35CB5D' }} />
              </div>
            </div>
          </section>

          <section className='flex switch-reason-section'>
            <div className='float-left' style={{ width: '30px', height: '30px' }} />

            <div className='switch-reason-container'>
              <Typography className='switch-reason-heading'>Reason for switch</Typography>

              <Typography className='switch-reason-message'>
                {/* Worsening credit situation. High exposer to sensitive / low rated papers. ||{' '} */}
                {data.remarks}
              </Typography>
            </div>
          </section>

          <Divider className='divider' />
        </>
      )}
    </div>
  );
};

export default withRouter(RebalanceFundItem);
