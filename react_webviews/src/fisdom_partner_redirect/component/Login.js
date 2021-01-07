import React, { useState } from 'react';
import fd_partner_login from 'assets/fisdom/fd_partner_login.svg';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import Arrow from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import { validate_user } from '../common/api';
// import { navigate as navigateFunc} from '../common/commonFunction';
import PhoneInput from '../../wealth_report/common/PhoneInput';
import toast from 'common/ui/Toast';
const Login = (props) => {
  const [countryCode, setCountryCode] = useState('91');
  const [format, setFormat] = useState('99999-99999');
  const [phoneErr, setPhoneErr] = useState('');
  const [number, setNumber] = useState('');
  // const navigate = navigateFunc.bind(props);
  // const nextPage = () => {
  //   navigate(props, '');
  // };
  const handleCodeChange = (event) => {
    let value = event.target.value.split('/');
    let code = value[0];
    let format = code.length <= 2 ? value[1].slice(code.length + 1) + '99' : '9999 9999 9999';

    setCountryCode(event.target.value);
    setFormat(format.split('.').join('9'));
    setPhoneErr('');
  };
  const handleNumberChange = (event) => {
    setPhoneErr('');
    setNumber(event.target.value);
  };
  const validatePhone = () => {
    let err = '';
    if (!countryCode) {
      err = 'Please select a country code';
    } else if (!number || number.split('-').join('').length !== 10) {
      err = 'Please enter a valid number';
    }
    return err;
  };

  const onKeyDown = (event) => {
    var code = event.keyCode;
    if (code === 13) {
      clickContinue();
    }
  };
  const clickContinue = async () => {
    const err = validatePhone();
    if (err) {
      setPhoneErr(err);
      return;
    }
    try {
      const user = await validate_user(number);
      if (user.msg) {
        alert('successful');
      } else {
        setPhoneErr('Sorry, it seems you are not an existing OBC-mPay customer.');
      }
    } catch (err) {
      toast(err)
    }
  };

  const goBack = () => {
    props.history.goBack();
  };
  return (
    <div className='fd-partner-login-container'>
      <section className='fd-partner-back'>
        <AppBar position='fixed' style={{ background: 'white' }}>
          <Toolbar>
            <IconButton style={{ color: '#4F2DA7' }} aria-label='Menu' onClick={goBack}>
              <Arrow />
            </IconButton>
          </Toolbar>
        </AppBar>
      </section>
      <section className='fd-partner-login-img'>
        <img
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          src={fd_partner_login}
          alt=''
        />
      </section>
      <section className='fd-partner-login-section'>
        <div className='fd-partner-login-right-panel'>
          <div className='fd-partner-mob-num'>Enter your mobile number</div>
          <div >
            <PhoneInput
              onCodeChange={handleCodeChange}
              onInputChange={handleNumberChange}
              phone={countryCode}
              format={format}
              number={number}
              onKeyDown={onKeyDown}
              autoFocus={true}
              disabled
            />
            <div style={{ color: 'red' }}>{phoneErr}</div>
          </div>
          <div className='fd-partner-button'>
            <Button
              className='DialogButtonFullWidth fd-partner-btn'
              onClick={clickContinue}
              color='default'
              autoFocus
            >
              CONTINUE
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
