import React, { useEffect, useState } from 'react';
import Container from '../common/Container';
import HeaderDataContainer from '../common/HeadDataContainer';
import Typography from '@material-ui/core/Typography';
import down_arrow from 'assets/dot_down_arrow.svg';
import { navigate } from '../common/commonFunction';
import DropdownInModal from 'common/ui/DropdownInModal';
import { storageService, dateOrdinal } from 'utils/validators';
const dates = [{ name: 1 }, { name: 2 }, { name: 3 }, { name: 4 }, { name: 5 }];
//const SipDateSelect = (props) => {
class SipDateSelect extends React.PureComponent {
  // nextPage = () => {
  //   navigate(this.props, 'otp');
  // };
  state = {
    funds: [],
    selectedIndex: '',
    date: this.props.el.investment_date || '',
    AllFunds:
      storageService().getObject('checked_funds').length > 0
        ? storageService().getObject('checked_funds')
        : [],
  };
  // componentDidMount() {
  //   const sip_funds = storageService().getObject('checked_funds');
  //   const new_sip = sip_funds?.filter((el) => el.name.includes('SIP'));
  //   new_sip.forEach((el) => {
  //     el.allowed_sip_dates.map((date, index) => {
  //       el.allowed_sip_dates[index] = {
  //         name: dateOrdinal(date),
  //       };
  //     });
  //   });
  //   console.log('sip funds', new_sip);
  //   this.setState({ funds: new_sip });
  // }
  handleChange = (el) => (index) => {
    this.setState({
      date: el.allowed_sip_dates_new[index].name,
    });
    this.props.handleChange(el)(index);
  };

  // handleChange = (el) => (index) => {
  //   // alert(index);
  //   // console.log(dates);
  //   this.setState({
  //     date: el.allowed_sip_dates_new[index].name,
  //     selectedIndex: index,
  //   });

  //   const newData = this.state.AllFunds?.map((fund) => {
  //     if (fund.id === el.id) {
  //       console.log('date', el.allowed_sip_dates);
  //       el.sip_day = el.allowed_sip_dates[index];
  //       //el.sip_day = this.state.date;
  //       return el;
  //     } else {
  //       return el;
  //     }
  //   });

  //   storageService().setObject('checked_funds', newData);
  // };
  render() {
    const { el } = this.props;
    return (
      <div className='fund-switch-date-container'>
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
                  // options={el.allowed_sip_dates}
                  options={el.allowed_sip_dates_new}
                  header_title='Select SIP Date'
                  cta_title='SAVE'
                  selectedIndex={this.state.selectedIndex}
                  value={dateOrdinal(this.state.date) || dateOrdinal(parseInt(el.recommended_date))}
                  //error={false}
                  //helperText='something is wrong'
                  width='40'
                  // label='Height (cm)'
                  //class='Education'
                  //id='height'
                  inputBox
                  //placeholder='EHllo'
                  //name='height'
                  onChange={this.handleChange(el)}
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
  const [date, setDate] = useState('');
  const [allFunds, setAllFunds] = useState(
    storageService().getObject('checked_funds').length > 0
      ? storageService().getObject('checked_funds')
      : []
  );
  const nextPage = () => {
    const new_data = storageService().getObject('checked_funds');
    const remove_additional_date = new_data.map((el) => {
      delete el.allowed_sip_dates_new;
      return el;
    });
    storageService().setObject('checked_funds', remove_additional_date);
    navigate(props, 'otp');
  };
  useEffect(() => {
    const sip_funds = storageService().getObject('checked_funds');
    const new_sip = sip_funds?.filter((el) => el.name.includes('SIP'));
    console.log('newsip', new_sip);
    new_sip.forEach((el) => {
      el.allowed_sip_dates_new = [];
      el.sip_day = '';
      el.allowed_sip_dates.map((date, index) => {
        // el.allowed_sip_dates[index] = {
        el.allowed_sip_dates_new[index] = {
          name: dateOrdinal(date),
        };
      });
      el.sip_day = parseInt(el.recommended_date);
    });
    // console.log('sip funds', new_sip);
    // const updated_date = new_sip.map((el) => {
    //   delete el.allowed_sip_dates_new;
    //   console.log(el);
    //   return el;
    // });
    storageService().setObject('checked_funds', new_sip);
    setFunds(new_sip);
  }, []);
  const handleChange = (el) => (index) => {
    // alert(index);
    // console.log(dates);
    //setDate(el.allowed_sip_dates_new[index].name);
    const x = storageService().getObject('checked_funds');
    setSelectedIndex(index);
    console.log('newFunds', x);
    console.log('el', el);
    const newData = x?.map((fund) => {
      if (fund.id === el.id) {
        console.log('date', el.allowed_sip_dates);
        el.sip_day = el.allowed_sip_dates[index];
        //el.sip_day = this.state.date;
        return el;
      } else {
        return fund;
      }
    });
    console.log('newData', newData);

    storageService().setObject('checked_funds', newData);
  };
  const goBack = () => {
    navigate(props, 'rebalance-fund');
  };
  return (
    <Container buttonTitle='Continue' handleClick={nextPage} fullWidthButton goBack={goBack}>
      <HeaderDataContainer title='Select SIP auto debit  date'>
        {funds.length > 0 &&
          funds.map((el) => {
            return (
              <SipDateSelect
                key={el.id}
                el={el}
                selectedIndex={selectedIndex}
                handleChange={handleChange}
                date={date}
              />
            );
          })}
        <section>
          <Typography className='sip-date-imp-info'>
            <span className='sip-date-note'>Note:</span> Please note that SIP rebalancing requests
            placed within 10 days of upcoming SIP debit date will be processed only for the next
            month.
          </Typography>
        </section>
      </HeaderDataContainer>
    </Container>
  );
};
export default Date;
