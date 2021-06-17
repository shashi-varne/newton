import React from 'react';
import './mini-components.scss';
import Input from 'common/ui/Input';
import Button from '@material-ui/core/Button';
import {SkeltonRect} from '../../../common/ui/Skelton';
import DotLoader from 'common/ui/DotDotLoaderNew';
const SdkInvestCard = ({
  title,
  subtitle,
  img,
  height,
  titleImg,
  referralCode,
  handleRefferalInput,
  referral,
  handleReferral,
  isLoading,
  path,
  handleCard,
  color,
  dot,
  dotLoader
}) => {
  let titleBg;
  if (titleImg) {
    titleBg = require(`assets/fisdom/${titleImg}`);
  }
  return (
    <div className={`card sdk-landing-card ${isLoading && 'disable-card-action'}`} style={{ height: height }} onClick={handleCard} data-aid='sdk-landing-card'>
      <div className='text' style={{ backgroundImage: `url(${titleBg})` }}>
        <div className='title' data-aid='sdk-landing-card-title'>{title}</div>
        {referralCode ? (
          <Input
            type='text'
            value={referral}
            onChange={handleRefferalInput}
            placeholder='Enter code here'
            disabled={dotLoader}
          />
        ) : (
          <div className={`subtitle ${dot && 'subtitle-status'}`} style={{color}} data-aid='subtitle-status'>
            {
              dot && !isLoading && <span className='sdk-card-dot' style={{background:color}}></span>
            }
            {
              isLoading ? <SkeltonRect className="sdk-card-status-load"/> : subtitle
            }
          </div>
        )}
      </div>
      <div className={`imageWrapper ${referralCode ? 'sdk-refferal-wrapper' : ''}`}>
        {referralCode ? (
          <div>
            <Button className={`sdk-refferal-btn ${!referral && 'disable-refferal-btn'}`} onClick={handleReferral} disabled={!referral} data-aid='sdk-refferal-btn'>
              {
                dotLoader ? <DotLoader />
               : 'Apply'
              }
              </Button>
          </div>
        ) : (
          <img src={require(`assets/fisdom/${img}`)} alt='helo' className='icon' />
        )}
      </div>
    </div>
  );
};

export default SdkInvestCard;