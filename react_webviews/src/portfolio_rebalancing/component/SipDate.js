import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import Typography from '@material-ui/core/Typography';
import down_arrow from 'assets/dot_down_arrow.svg';
import { navigate } from '../common/commonFunction';
import DropdownInModal from 'common/ui/DropdownInModal';
import { storageService, dateOrdinal } from 'utils/validators';
import { nativeCallback } from 'utils/native_callback';
class SipDateSelect extends React.Component {
  state = {
    selectedIndex: '',
    date: this.props.el.recommended_date || '',
  };
  handleChange = (el) => (index) => {
    this.setState({
      date: el.allowed_sip_dates[index],
    });
    this.props.handleChange(el)(index);
  };

  render() {
    const { el } = this.props;
    return (
      <div className='pr-sip-date'>
        <div key={el.id} className='card '>
          <section className='fund-switch-from'>
            <Typography className='fund-switch-name'>{el.mf.friendly_name}</Typography>
            <section className='fund-invest-amount-container'>
              <div className='invest-container'>
                <Typography className='sub-head light-bold'>Investment date</Typography>
                <Typography className='sub-value light-bold'>{`${dateOrdinal(
                  el.investment_date
                )} of every month`}</Typography>
              </div>
              <div className='amount-container'>
                <Typography className='sub-head light-bold'>Amount</Typography>
                <Typography className='sub-value light-bold'>{el.amount}</Typography>
              </div>
            </section>
          </section>
          <div className='arrow-separator'>
            <img src={down_arrow} alt='down-arrow' />
          </div>
          <section className='recommended-switch-fund'>
            <div className='recommended-fund-detail'>
              <Typography className='recommended-fund-name'>
                {el.recommended_mf.friendly_name}
              </Typography>
              <Typography className='recommended-fund-amount'>₹ {el.amount}</Typography>
            </div>
            <div className='sip-date-container'>
              <Typography className='sip-auto-debit'>SIP auto debit date</Typography>
              <div>
                <DropdownInModal
                  parent={this}
                  options={el.allowed_sip_dates_new}
                  header_title='Select SIP Date'
                  cta_title='SAVE'
                  selectedIndex={this.state.selectedIndex}
                  // eslint-disable-next-line radix
                  value={dateOrdinal(this.state.date) || dateOrdinal(parseInt(el.recommended_date))}
                  width='40'
                  inputBox
                  onChange={this.handleChange(el)}
                  isAppendText='of every month'
                  class='pr-input-append-text'
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

const Date = (props) => {
  const [funds, setFunds] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState('');
  useEffect(() => {
    const allFunds = storageService().getObject('allFunds');
    const checkMap = storageService().getObject('checkMap');
    allFunds.forEach((el) => {
      if (checkMap[el.id]) {
        if (el.is_sip) {
          el.allowed_sip_dates_new = [];
          el.sip_day = '';
          // eslint-disable-next-line array-callback-return
          el.allowed_sip_dates.map((date, index) => {
            el.allowed_sip_dates_new[index] = {
              name: dateOrdinal(date) + ' of every month',
            };
          });
          // eslint-disable-next-line radix
          el.sip_day = parseInt(el.recommended_date);
        }
      }
    });
    storageService().setObject('allFunds', allFunds);
    setFunds(allFunds);
  }, []);

  const sendEvents = (user_action) => {
    let eventObj = {
      event_name: 'portfolio_rebalancing',
      properties: {
        user_action: user_action,
        screen_name: 'select sip date',
      },
    };
    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };
  const nextPage = () => {
    const remove_additional_date = funds.map((el) => {
      if (el.allowed_sip_dates_new) delete el.allowed_sip_dates_new;
      return el;
    });
    storageService().setObject('allFunds', remove_additional_date);
    sendEvents('next');

    navigate(props, 'otp');
  };
  const handleChange = (fundItem) => (index) => {
    const allFunds = storageService().getObject('allFunds');

    const newData = allFunds.map((fund) => {
      if (fund.is_sip && fund.sip_day) {
        if (fund.id === fundItem.id) {
          fundItem.sip_day = fundItem.allowed_sip_dates[index];
          return fundItem;
        } else {
          return fund;
        }
      } else {
        return fund;
      }
    });
    setSelectedIndex(index);
    storageService().setObject('allFunds', newData);
    setFunds(newData);
  };

  const goBack = () => {
    sendEvents('back');
    navigate(props, 'rebalance-fund');
  };
  return (
    <Container
      buttonTitle='Rebalance Funds'
      handleClick={nextPage}
      goBack={goBack}
      events={sendEvents('just_set_events')}
      title='Select SIP auto debit  date'
      classOverRideContainer='pr-container'
      fullWidthButton={true}
      onlyButton={true}
    >
      <Typography className='pr-sip-transaction' align='left'>
        SIP switch transactions
      </Typography>
      {funds.length > 0 &&
        // eslint-disable-next-line array-callback-return
        funds.map((el) => {
          const checkMap = storageService().getObject('checkMap');
          if (el.is_sip && checkMap[el.id]) {
            return (
              <SipDateSelect
                key={el.id}
                el={el}
                selectedIndex={selectedIndex}
                handleChange={handleChange}
              />
            );
          }
        })}
      <section>
        <Typography className='pr-sip-date-imp-info'>
          <span className='sip-date-note'>Note:</span> Please note that SIP rebalancing requests
          placed within 10 days of upcoming SIP debit date will be processed only for the next
          month.
        </Typography>
      </section>
    </Container>
  );
};
export default Date;
