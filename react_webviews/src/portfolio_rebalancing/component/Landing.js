import React, { useEffect } from 'react';
import HeadDataContainer from '../common/HeadDataContainer';
import Container from '../common/Container';
// import sip_switch_img from '../../assets/sip_switch.svg';
// import corpus_switch_img from '../../assets/corpus_switch.svg';
// import sip_corpus_switch_img from '../../assets/sip_corpus_switch.svg';
// import rebalance_date from '../../assets/rebalance_date.svg';
// import rebalance_pointer from '../../assets/rebalance_pointer.svg';
// import rebalance_report from '../../assets/rebalance_report.svg';
import sebi_registered_logo from 'assets/sebi_registered_logo.svg';
import encryption_ssl_logo from 'assets/encryption_ssl_logo.svg';
import { navigate } from '../common/commonFunction';
import './Style.scss';
import { Typography } from '@material-ui/core';
import { storageService } from 'utils/validators';
import { getConfig } from 'utils/functions';
const Landing = (props) => {
  useEffect(() => {
    storageService().setObject('checked_funds', []);
    storageService().setObject('sip', []);
    storageService().setObject('corpus', []);
    storageService().setObject('sip_corpus', []);
    console.log('landing page');
  }, []);
  const product_name = getConfig().productName;

  const nextPage = () => {
    navigate(props, 'rebalance-fund');
  };
  return (
    <Container buttonTitle='Continue' fullWidthButton handleClick={nextPage}>
      <HeadDataContainer title='Portfolio rebalancing'>
        <section>
          <p className='landing-page-container'>
            <span className='landing-page-data'>Optimize your portfolio</span> by switching your
            investments from funds that are not perfoming well into funds that carry lesser risk and
            are likely to give better returns.
          </p>
        </section>
        <section>
          <Typography className='sub-bold-heading'>Types of switch</Typography>
          <div
            // className='card-switch-container'
            style={{
              margin: '0px -15px 0px -15px',
              padding: '0 15px 0 15px',
              overflow: 'hidden',
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', width: 'fit-content' }}>
              <div className='card-switch'>
                <img src={require(`assets/${product_name}/sip_switch.svg`)} alt='sip_switch' />
              </div>
              <div className='card-switch'>
                <img src={require(`assets/${product_name}/corpus_switch.svg`)} alt='sip_switch' />
              </div>
              <div className='card-switch'>
                <img
                  src={require(`assets/${product_name}/sip_corpus_switch.svg`)}
                  alt='sip_switch'
                />
              </div>
            </div>
            {/* <div className='card-switch'>
              <img src={sip_switch_img} alt='sip_switch' />
            </div>
            <div className='card-switch'>
              <img src={corpus_switch_img} alt='sip_switch' />
            </div>
            <div className='card-switch'>
              <img src={sip_corpus_switch_img} alt='sip_switch' />
            </div> */}
          </div>
        </section>
        <section className='rebalance-step-container'>
          <Typography className='sub-bold-heading'>How it Works</Typography>
          <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_pointer.svg`)}>
            1. Choose the fund(s) you wish to rebalance, we recommend all
          </RebalanceSteps>
          <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_date.svg`)}>
            2. Select SIP date(s), if applicable
          </RebalanceSteps>
          <RebalanceSteps svg_file={require(`assets/${product_name}/rebalance_report.svg`)}>
            3. Tap on “Rebalance funds” and you are all set
          </RebalanceSteps>
        </section>
        <p className='note-text'>
          <span className='note-bold-text'>Note:</span> The exercise is done based on fisdom’s
          proprietary research methodology and rebalancing algorithms.
        </p>
        <section>
          <p className='secure-text'>Investments with fisdom are 100% secure</p>
          <div className='secure-image--container'>
            <img src={sebi_registered_logo} alt={sebi_registered_logo} />
            <img src={encryption_ssl_logo} alt={encryption_ssl_logo} />
          </div>
        </section>
      </HeadDataContainer>
    </Container>
  );
};

const RebalanceSteps = ({ svg_file, children }) => {
  return (
    <div className='rebalance-steps'>
      <img src={svg_file} alt={svg_file} className='rebalance-steps-img' />
      <Typography className='rebalance-steps-text'>{children}</Typography>
    </div>
  );
};

export default Landing;
