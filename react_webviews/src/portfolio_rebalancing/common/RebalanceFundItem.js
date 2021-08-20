import React, { useState } from 'react';

import AddIcon from '@material-ui/icons/Add';

import Remove from '@material-ui/icons/Remove';

import Checkbox from '@material-ui/core/Checkbox';

import Chip from '@material-ui/core/Chip';

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
import down_arrow from 'assets/dot_down_arrow.svg';
import { nativeCallback } from 'utils/native_callback';
import ToolTip from 'common/ui/TooltipLite';

const RebalanceFundItem = ({ classes, data, ...props }) => {
  const [checked, setChecked] = useState(false);

  const [toolTip, setToolTip] = useState(false);

  const color = getConfig().styles.primaryColor;

  const [open, setOpen] = useState(false);
  const product_name = getConfig().productName;
  React.useEffect(() => {
    const checkMap = storageService().getObject('checkMap');

    setChecked(checkMap[data.id]);
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'select rebalance funds',
        more_details_clicked: open ? 'yes' : 'no',
      },
    };
    nativeCallback({ events: eventObj });
  };

  const handleChange = (e) => {
    const checkMap = storageService().getObject('checkMap');
    const checks = e.target.checked;
    setChecked(checks);
    checkMap[data.id] = checks;
    storageService().setObject('checkMap', checkMap);
  };
  const handleFundDetails = (isin) => {
    sendEvents('fund details');
    navigate(props, null, '/fund-details', { isin });
  };
  const toolTipContent = () => {
    if (!data.sip_only && !data.is_sip) {
      return (
        <>
          <span className='fund-type-head'>Corpus switch</span>

          <span>
            : Redeem the money invested in low performing fund & re-invest in recommended funds.
          </span>
        </>
      );
    } else if (data.sip_only) {
      return (
        <>
          <span className='fund-type-head'>SIP switch</span>

          <span>: Stop SIP in low performing funds & re start in recommended funds.</span>
        </>
      );
    } else if (!data.sip_only && data.is_sip) {
      return (
        <>
          <span className='fund-type-head'>SIP + Corpus switch</span>

          <span>
            : Switch SIP & accumulated corpus from low performing funds to recommended funds.
          </span>
        </>
      );
    }
  };
  return (
    <div className='pr-rebalance-fund-item'>
      {data && (
        <>
          <section className='switch-folio-container flex-item'>
            <div className='fund-select-checkbox flex-item left-item'>
              <Checkbox
                className='checkbox'
                checked={checked}
                style={{ color }}
                onChange={handleChange}
                icon={<UnChecked size='15' borderColor={color} />}
                checkedIcon={<Checked size='15' color={color} borderColor={color} />}
                disableRipple
              />
            </div>

            <div className='switch-badge flex-item right-item'>
              <p className='folio-number-text'>Folio: {data.folio_number || 'N/A'}</p>

              <div className='flex-item'>
                <Chip className='badge' label={` ${data.name} SWITCH `} />

                <div className='fund-type-tooltip'>
                  <ToolTip
                    content={toolTipContent()}
                    background='#f0f7ff'
                    direction='down'
                    backgroundArrow='#f0f7ff'
                    className='fd-tooltip-container'
                    isOpen={toolTip}
                    onClickAway={() => setToolTip(false)}
                  >
                    <img
                      src={require(`assets/${product_name}/info_icon.svg`)}
                      className='info-tip'
                      alt='info'
                      onClick={() => setToolTip(!toolTip)}
                    />
                  </ToolTip>
                </div>
              </div>
            </div>
          </section>

          <section className='fund-detail-container flex-item'>
            <div className='image-container from-fund  left-item'>
              <img src={data.mf.amc_logo_big} className='fund-image' alt='hello' />
            </div>

            <div className='fund-container right-item flex-item'>
              <div>
                <Typography className='fund-title'>{data.mf.friendly_name}</Typography>
                <Typography className='fund-status flex-item'>
                  Expert outlook: <span className='expert-status-negative'>Negative</span>
                </Typography>
              </div>
              <div
                style={{ cursor: 'pointer', zIndex: '1' }}
                onClick={() => {
                  setOpen(!open);
                }}
              >
                {open ? <Remove /> : <AddIcon />}
              </div>
            </div>
          </section>

          <section className={`pr-arrow-container flex-item ${open && 'pr-expand-arrow'}`}>
            <div className='image-container  arrow left-item arrow'>
              <div className='arrow-image' />

              <span className='bigger-arrow'>
                <img src={down_arrow} alt='down-arrow' />
              </span>
            </div>

            <div className='sip-amount-details right-item'>
              <Fade in={open} timeout={350}>
                <div>
                  <Typography className='sip-amount-text'>Amount</Typography>

                  <Typography className='sip-amount-num'>{data.amount}</Typography>
                </div>
              </Fade>
            </div>
          </section>

          <div className='flex-item'>
            <div
              className='left-item'
              style={{ width: '30px', height: '10px', marginBottom: '8px' }}
            />

            <Typography className='pr-recommended-text'>Recommended fund</Typography>
          </div>

          <section className='fund-detail-container flex-item'>
            <div className='image-container from-fund left-item'>
              <img src={data.recommended_mf.amc_logo_big} className='fund-image' alt='hello' />
            </div>

            <div className='fund-container right-item flex-item'>
              <div>
                <h4 className='fund-title'>{data.recommended_mf.friendly_name}</h4>

                <p className='fund-status flex-item'>
                  Expert outlook: <span className='expert-status-positive'>Positive</span>
                </p>
              </div>

              <div onClick={() => handleFundDetails(data.recommended_mf.isin)}>
                <KeyboardArrowRightIcon style={{ color: '#35CB5D', cursor: 'pointer' }} />
              </div>
            </div>
          </section>

          <section className='flex-item switch-reason-section'>
            <div className='left-item' style={{ width: '30px', height: '30px' }} />

            <div className='switch-reason-container'>
              <Typography className='switch-reason-heading'>Reason for switch</Typography>

              <Typography className='switch-reason-message'>{data.remarks}</Typography>
            </div>
          </section>

          <Divider className='divider' />
        </>
      )}
    </div>
  );
};

export default withRouter(RebalanceFundItem);
