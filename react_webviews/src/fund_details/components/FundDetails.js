import React, { useState, useEffect } from 'react';
import Container from '../common/Container';
import { fetch_fund_details, fetch_fund_graph } from '../common/ApiCalls';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import Accordian from '../common/Accordian';
import List from '@material-ui/core/List';
import FundPortfolio from './FundPortfolio';
import Returns from './Returns';
import FundInfo from './FundInfo';
import RiskDetails from './RiskDetails';
import { getUrlParams } from '../../utils/validators';
import FundCarousel from './FundCarousel';
import FundChart from './FundChart';
import RatingStar from '../common/RatingStar';
import CircularProgress from '@material-ui/core/CircularProgress';
import toast from '../../common/ui/Toast';
import morning_star_logo from 'assets/morning_star_logo.png';
import morning_star_small from 'assets/morning_star_small.svg';
import { getConfig, isIframe } from 'utils/functions';
import { withStyles } from '@material-ui/core/styles';
import IframeContainer from '../../e_mandate/commoniFrame/Container';

import './Style.scss';
const styles = {
  root: {
    margin: '10px',
  },
};
const FundDetails = ({ classes, history }) => {
  const [isLoading, setLoading] = useState(true);
  const [fundDetails, setFundDetails] = useState(null);
  const [reports, setReports] = useState(null);
  const [graph, setGraph] = useState(null);
  const [selectedIsin, setSelectedIsin] = useState(0);
  const productType = getConfig().productName;
  const [open, setOpen] = useState(false);
  const iframe = isIframe();
  const isMobile = getConfig().isMobileDevice;
  const { isins, selected_isin, type } = getUrlParams();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await fetch_fund_details(isins);
        const index = response?.text_report?.findIndex((el) => el.isin === selected_isin);

        const { idx, array } = swap_fund_index(index, response?.text_report);
        if (idx) {
          setReports(array);
          setSelectedIsin(idx);
        } else {
          setSelectedIsin(index);
          setReports(response?.text_report);
        }
        setFundDetails(response?.text_report[0]);
        setLoading(false);
        if (response?.text_report?.length === 1) {
          await fetch_graph_data(response?.text_report[0]?.isin);
        }
      } catch (err) {
        toast('wrong', 'error');
        setLoading(false);
      }
    })();
  }, []);
  // swap the fund index if it is 0 or last.
  const swap_fund_index = (index, array) => {
    let idx;
    if (index === 0) {
      [array[0], array[1]] = [array[1], array[0]];
      idx = 1;
    }
    if (index === array?.length - 1) {
      [array[array?.length - 1], array[array?.length - 2]] = [
        array[array?.length - 2],
        array[array?.length - 1],
      ];
      idx = array?.length - 2;
    }
    return { idx, array };
  };
  const fetch_graph_data = async (isin) => {
    setGraph(null);
    const graph_data = await fetch_fund_graph(isin);
    setGraph(graph_data);
  };

  const onFundChange = (el) => {
    fetch_graph_data(reports[el].isin);
    setFundDetails(reports[el]);
  };
  const goBack = () => {
    if(type === 'diy'){
      handleInvest();
    } else {
      history.goBack();
    }
  };

  const handleInvest = () => {
    window.location.href =  getConfig().webAppUrl + 'diy/invest';
  }

  const ContainerData = () => (
    <>
      {(!iframe || isMobile) && (
        <div
          className={`fund-detail-cover-bg ${productType === 'fisdom' ? 'fisdom-bg' : 'myway-bg'}`}
        ></div>
      )}
      <div className='fund-container'>
        {!iframe || isMobile ? (
          <section className='fund-info-container'>
            <FundCarousel
              reports={reports}
              onFundChange={onFundChange}
              selectedIsin={selectedIsin}
            />

            <Typography
              style={{
                fontSize: '16px',
                fontWeight: '600',
                lineHeight: '20px',
                color: '#0A1D32',
              }}
              align='center'
            >
              {fundDetails.performance?.friendly_name}
            </Typography>
            <Typography
              align='center'
              style={{
                color: '#35CB5D',
                fontWeight: '500',
                letterSpacing: '0.5px',
                lineHeight: '1.5em',
                fontSize: '18px',
              }}
            >
              +{fundDetails.performance?.primary_return}%
            </Typography>
            <Typography
              variant='subheading'
              align='center'
              style={{
                color: '#878787',
                letterSpacing: '0.4px',
                fontSize: '11px',
                fontWeight: '300',
              }}
            >
              RETURNS ({fundDetails.performance?.primary_return_duration})
            </Typography>
            <div className='fund-category-risk'>
              {fundDetails.performance.category && (
                <Chip label={fundDetails.performance.category} className='fund-badge' />
              )}
              {fundDetails.performance.ms_risk && (
                <Chip label={fundDetails.performance.ms_risk} className='fund-badge' />
              )}
            </div>
            <div className='fund-value-star'>
              <section className='fund-value-star-section'>
                <Typography
                  style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                  align='center'
                  justify='center'
                >
                  {'₹ ' + fundDetails.performance.current_nav}
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#878787' }} align='center'>
                  NAV - {fundDetails.performance.nav_update_date}
                </Typography>
              </section>
              <section className='fund-value-star-section'>
                <Typography
                  style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                  align='center'
                >
                  {'₹ ' + fundDetails.performance.aum}
                </Typography>
                <Typography style={{ fontSize: '11px', color: '#878787' }} align='center'>
                  AUM
                </Typography>
              </section>
              <section className='fund-value-star-section'>
                <div
                  style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                  align='center'
                >
                  <RatingStar value={fundDetails.performance.ms_rating} />
                </div>
                <Typography
                  style={{
                    width: '50px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    fontSize: '14px',
                    color: '#878787',
                  }}
                  align='center'
                >
                  <img
                    style={{ width: '100%', objectFit: 'contain' }}
                    src={morning_star_logo}
                    alt='mr rating'
                  />
                </Typography>
              </section>
            </div>
          </section>
        ) : (
          <section className='fundinfo-iframe'>
            <section className='fundinfo-iframe-details'>
                <div className='fundinfo-iframe-head'>
                  <div className='fund-info--iframe-icon'>
                    <img
                      src={fundDetails?.performance?.amc_logo_small}
                      alt='fund'
                      style={{ width: '50px', height: '50px' }}
                    />
                  </div>
                  <div className='fundinfo-iframe-name'>
                    {fundDetails.performance?.friendly_name}
                  </div>
                </div>
                <div className='fundinfo-iframe-status'>
                  <div>
                    {fundDetails.performance.category && (
                      <Chip label={fundDetails.performance.category} className='fund-badge-cat' />
                    )}
                  </div>
                  <div>
                    {fundDetails.performance.ms_risk && (
                      <Chip label={fundDetails.performance.ms_risk} className='fund-badge-risk' />
                    )}
                  </div>
                  <div className='fundinfo-iframe-return'>
                    <span className='fundinfo-iframe-return-per'>
                      +{fundDetails.performance?.primary_return}%
                    </span>
                    <span className='fundinfo-iframe-return-year'>
                      {' '}
                      {`in ${fundDetails.performance?.primary_return_duration}`}
                    </span>
                  </div>
                </div>
                <div className='fundinfo-iframe-data'>
                  <div className='fund-value-star'>
                    <section className='fund-value-star-section'>
                      <Typography
                        style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                        align='center'
                        justify='center'
                      >
                        {'₹ ' + fundDetails.performance.current_nav}
                      </Typography>
                      <Typography
                        style={{ fontWeight: 700, fontSize: '8px', color: '#767E86' }}
                        align='center'
                      >
                        NAV - {fundDetails.performance.nav_update_date}
                      </Typography>
                    </section>
                    <div className='fundinfo-iframe-divider' />
                    <section className='fund-value-star-section'>
                      <Typography
                        style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                        align='center'
                      >
                        {'₹ ' + fundDetails.performance.aum}
                      </Typography>
                      <Typography
                        style={{ fontWeight: 700, fontSize: '8px', color: '#767E86' }}
                        align='center'
                      >
                        AUM
                      </Typography>
                    </section>
                    <div className='fundinfo-iframe-divider' />
                    <section className='fund-value-star-section'>
                      <div
                        style={{ fontWeight: 400, fontSize: '14px', lineHeight: '16px' }}
                        align='center'
                      >
                        <RatingStar value={fundDetails.performance.ms_rating} height='10px' />
                      </div>
                      <Typography
                        style={{
                          width: '50px',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          fontSize: '14px',
                          color: '#878787',
                        }}
                        align='center'
                      >
                        <img src={morning_star_small} alt='mr rating' />
                      </Typography>
                    </section>
                  </div>
                </div>
            </section>
          </section>
        )}
        <Divider classes={{ root: classes.root }} />
        <section
          style={{
            height: '300px',
            minHeight: '200px',
            minWidth: '100%',
            marginTop: '2em',
          }}
        >
          {graph ? (
            <FundChart graphData={graph} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <CircularProgress size={50} style={{ color: '#878787' }} />
            </div>
          )}
        </section>

        <section className='fund-more-info'>
          <List component='nav'>
            <Divider classes={{ root: classes.root }} />

            <Accordian title='Returns'>
              <Returns returnsData={fundDetails.performance.returns} iframe={iframe}/>
            </Accordian>
            <Divider classes={{ root: classes.root }} />
            <Accordian title="Fund's Info">
              <FundInfo title='Launch date' content={fundDetails.additional_info.launch_date} />
              <FundInfo
                title='Previously Known as'
                content={fundDetails.additional_info.previous_known_name}
              />
              <FundInfo title='Fund Managers' content={fundDetails.additional_info.fund_managers} />
              <FundInfo title='ISIN' content={fundDetails.additional_info.isin} />
              <FundInfo title='Exit Load' content={fundDetails.additional_info.exit_load} />
              <FundInfo
                title='Minimum investment'
                content={fundDetails.additional_info.minimum_investment}
              />
            </Accordian>
            <Divider classes={{ root: classes.root }} />
            <Accordian title='Portfolio Details'>
              <FundPortfolio
                portfolio={fundDetails.portfolio}
                navDate={fundDetails.performance.nav_update_date}
              />
            </Accordian>
            <Divider classes={{ root: classes.root }} />
            <Accordian title='More Risk Details'>
              <RiskDetails riskDetailsData={fundDetails.risk} />
            </Accordian>
            <Divider classes={{ root: classes.root }} />
          </List>
        </section>
        <section
          style={{
            width: '100%',
            paddingLeft: '15px',
            fontSize: '14px',
            color: '#878787',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <div>*</div>
          <img
            style={{ width: '50px', objectFit: 'contain', marginLeft: '1.2px' }}
            src={morning_star_logo}
            alt='mr rating'
          />
          <div style={{ fontSize: '12px', fontWeight: '400',cursor:"pointer" }} onClick={handleDisclaimer}>
            Disclaimer
          </div>
        </section>
        {open && (
          <div
            style={{
              width: '100%',
              paddingLeft: '15px',
              fontSize: '14px',
              color: '#878787',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              lineHeight: '1.4',
              marginTop: '20px',
            }}
          >
            An assessment of the variations in a fund's monthly returns in comparison to similar
            funds, with an emphasis on downward variation. The greater the variation, the larger the
            risk score. If two funds have the exact same return, the one with greater variations in
            its return is given the larger risk score. In each Morningstar Category, the 10% of
            funds with the lowest measured risk are described as Low Risk, the next 22.5% Below
            Average, the middle 35% Average, the next 22.5% Above Average, and the top 10% High.
            Morningstar Risk is measured for up to three time periods (three-, five-, and 10-years).
            These separate measures are then weighted and averaged to produce an overall measure for
            the fund. Funds with less than three years of performance history are not rated.
          </div>
        )}
      </div>
    </>
  );

  const handleDisclaimer = () => {
    setOpen(!open);
  };

  return (
    <div>
      {!iframe ? (
        <Container
          title={fundDetails?.performance?.friendly_name}
          hideInPageTitle={true}
          noPadding
          fullWidthButton
          handleClick={goBack}
          buttonTitle={type === 'diy' ? 'INVEST' : 'OK'}
          showLoader={isLoading}
          classOverRideContainer='fd-container'
        >
          {fundDetails && ContainerData()}
        </Container>
      ) : (
        <IframeContainer
          hideInPageTitle={true}
          noPadding
          fullWidthButton
          handleClick={handleInvest}
          buttonTitle={'INVEST NOW'}
          showLoader={isLoading}
          classOverRideContainer='fd-container-iframe'
        >
          {fundDetails && ContainerData()}
        </IframeContainer>
      )}
    </div>
  );
};

export default withStyles(styles)(FundDetails);
