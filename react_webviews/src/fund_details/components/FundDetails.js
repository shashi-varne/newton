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
import { getUrlParams, isEmpty } from '../../utils/validators';
import FundCarousel from './FundCarousel';
import FundChart from './FundChart';
import RatingStar from '../common/RatingStar';
import CircularProgress from '@material-ui/core/CircularProgress';
import toast from '../../common/ui/Toast';
import morning_star_logo from 'assets/morning_star_logo.png';
import { getConfig } from 'utils/functions';
import { withStyles } from '@material-ui/core/styles';
import { storageService } from 'utils/validators';
import CartDialog from './CartDialog';

import './Style.scss';
import { isInvestRefferalRequired, proceedInvestmentChild } from '../../dashboard/invest/functions';
import useUserKycHook from '../../kyc/common/hooks/userKycHook';
import PennyVerificationPending from '../../dashboard/invest/components/mini_components/PennyVerificationPending';
import InvestError from '../../dashboard/invest/components/mini_components/InvestError';
import InvestReferralDialog from '../../dashboard/invest/components/mini_components/InvestReferralDialog';
import { SkeltonRect } from '../../common/ui/Skelton';

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

  const { type } = getUrlParams();
  const EMPTY_CART = 'EMPTY_CART';
  const FUND_ADDED = 'FUND_ADDED';
  const ADD_CART = '+ Add to Cart';
  const ENTER_AMOUNT = 'Enter Amount';
  const INVEST = 'INVEST';
  const CART_LIMIT = 24;

  const funds = storageService().getObject('diystore_cart') || [];
  const fund = storageService().getObject('diystore_fundInfo') || {};
  let currentStatus = type === 'diy' ? EMPTY_CART : '';
  let currentTitle = 'Ok';

  const investment = JSON.parse(window.localStorage.getItem("investment")) || {};

  switch (type) {
    case "diy" :
      funds.forEach((item) => {
        if (item.isin === fund.isin) {
          currentStatus = FUND_ADDED;
        }
      });
      if( productType === 'finity' ) {
        currentTitle = INVEST;
      } else {
        currentTitle = ADD_CART;
      }
    break;
    case "mf": 
      if(isEmpty(investment)) {
        history.goBack();
      }
      currentTitle = INVEST;
      break;
    default:
      break;
  }

  const [cart, setCart] = useState([...funds])
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [buttonTitle, setButtonTitle] = useState(currentTitle);
  const { kyc, isLoading: loading } = useUserKycHook();
  const [dialogStates, setDialogStates] = useState({});
  const [isApiRunning, setIsApiRunning] = useState(false);
  
  const buttonData = (length) => {
    return (
      <div className="fund-details-dual-button-content">
        <div className="cart-content">
          <img alt="" src={require(`assets/add_cart_icon.png`)} />
          <span>{length}</span>
        </div>
        <span>funds <br/> in cart</span>
      </div>
    );
  };

  const handleRemoveFromCart = (item) => () => {
    if (cart.length > 0) {
      const updatedCartItems = cart.filter(({ isin }) => isin !== item.isin);
      setCart(updatedCartItems);
      storageService().setObject("diystore_cart", updatedCartItems);
      if(item.isin === fund.isin) {
        setStatus(EMPTY_CART)
        setButtonTitle(ADD_CART)  
      } else {
        setButtonTitle(buttonData(updatedCartItems.length))
      }
      if(updatedCartItems.length === 0) close();
    }
  };
  
  useEffect(() => {
    if(status === FUND_ADDED && type === 'diy' && productType !== 'finity') {
      setButtonTitle(buttonData(cart.length));
    } 
    (async () => {
      try {
        setLoading(true);
        const { isins, selected_isin } = getUrlParams();
        const response = await fetch_fund_details(isins);
        let index = response?.text_report?.findIndex((el) => el.isin === selected_isin);
        if(isins === selected_isin){
          index = -1;
        }

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

  const handleClick = () => {
    if (productType === "finity" && type === "diy") {
      storageService().setObject("diystore_cart", [fund]);
      handleClick2();
      return;
    }
    switch (type) {
      case "diy":
        let stage = status;
        switch (stage) {
          case "EMPTY_CART":
            if (cart.length >= CART_LIMIT) {
              toast(
                `You can only invest in ${CART_LIMIT} funds at a time. Please change one of the funds.`
              );
              return;
            }
            let updatedList = [...cart, fund];
            setCart(updatedList);
            storageService().setObject("diystore_cart", updatedList);
            setButtonTitle(buttonData(updatedList.length));
            setStatus(FUND_ADDED);
            break;
          case "FUND_ADDED":
            setIsOpen(true);
            break;
          default:
            break;
        }
        break;
      case "mf":
        proceedInvestment()
        break;
      default:
        history.goBack();
        break;
    }
  };

  const close = () => {
    setIsOpen(false)
  }

  const handleClick2 = () => {
    navigate("/diy/invest")
  };

  const proceedInvestment = (investReferralData, isReferralGiven) => {
    const sipTypesKeys = [
      "buildwealth",
      "savetaxsip",
      "saveforgoal",
      "indexsip",
      "shariahsip",
      "sectoralsip",
      "midcapsip",
      "balancedsip",
      "goldsip",
      "diysip",
    ];
    let sipOrOneTime = "";
    if ((investment.type !== "riskprofile") & (investment.type !== "insta-redeem")) {
      sipOrOneTime = "onetime";
      if (sipTypesKeys.indexOf(investment.type) !== -1) {
        sipOrOneTime = "sip";
      }
    } else {
      sipOrOneTime = investment.order_type;
    }
    let paymentRedirectUrl = encodeURIComponent(
      `${window.location.origin}/page/callback/${sipOrOneTime}/${investment.amount}`
    );

    if (
      isInvestRefferalRequired(getConfig().partner.code) &&
      !isReferralGiven
    ) {
      handleDialogStates("openInvestReferral", true);
      return;
    }

    let body = {
      investment: investment,
    };

    if (isReferralGiven && investReferralData.code) {
      body.referral_code = investReferralData.code;
    }

    proceedInvestmentChild({
      sipOrOnetime: sipOrOneTime,
      body: body,
      paymentRedirectUrl: paymentRedirectUrl,
      isSipDatesScreen: false,
      history: history,
      userKyc: kyc,
      handleApiRunning: handleApiRunning,
      handleDialogStates: handleDialogStates,
    });
  };

  const handleApiRunning = (result) => {
    setIsApiRunning(result);
  };

  const handleDialogStates = (key, value, errorMessage) => {
    let dialog_states = { ...dialogStates };
    dialog_states[key] = value;
    if (errorMessage) dialog_states["errorMessage"] = errorMessage;
    setDialogStates({ ...dialog_states });
    handleApiRunning(false)
  };

  const navigate = (pathname) => {
    history.push({
      pathname: pathname,
      search: getConfig().searchParams,
    })
  }

  return (
    <div>
      <Container
        title={fundDetails?.performance?.friendly_name}
        hidePageTitle={true}
        hideInPageTitle={true}
        noPadding
        // fullWidthButton
        handleClick={handleClick}
        handleClickOne={handleClick}
        buttonTitle={buttonTitle}
        buttonOneTitle={buttonTitle}
        skelton={isLoading || loading}
        classOverRideContainer='fd-container'
        twoButton= {status === 'FUND_ADDED' && productType !== 'finity' }
        buttonTwoTitle={ ENTER_AMOUNT }
        handleClickTwo={handleClick2}
        handleClick2={handleClick2} // old container field
        buttonTitle2={ENTER_AMOUNT} // old container field
        showLoader={isApiRunning}
        type={status === 'FUND_ADDED' && productType !== 'finity' ? "fundDetailsDualButton" : ""}
      >
        {fundDetails && (
          <>
            <div
              className={`fund-detail-cover-bg ${
                productType === 'fisdom' ? 'fisdom-bg' : 'myway-bg'
              }`}
            ></div>
            <div className='fund-container'>
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
                  <SkeltonRect 
                    style={{
                        width: 'calc(100% - 30px)',
                        height: '100%',
                        margin: "0 15px",
                      }} 
                  />
                )}
              </section>

              <section className='fund-more-info'>
                <List component='nav'>
                  <Divider classes={{ root: classes.root }} />

                  <Accordian title='Returns'>
                    <Returns returnsData={fundDetails.performance.returns} />
                  </Accordian>
                  <Divider classes={{ root: classes.root }} />
                  <Accordian title="Fund's Info">
                    <FundInfo
                      title='Launch date'
                      content={fundDetails.additional_info.launch_date}
                    />
                    <FundInfo
                      title='Previously Known as'
                      content={fundDetails.additional_info.previous_known_name}
                    />
                    <FundInfo
                      title='Fund Managers'
                      content={fundDetails.additional_info.fund_managers}
                    />
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
                <div style={{ fontSize: '12px', fontWeight: '400' }}>Disclaimer</div>
              </section>
            </div>
          </>
        )}
       {type === "diy" && (
          <CartDialog
            open={isOpen}
            close={close}
            cart={cart}
            setCart={setCart}
            handleRemoveFromCart={handleRemoveFromCart}
            handleClick={handleClick2}
          />
        )}
        {type === "mf" && (
          <>
            {dialogStates.openPennyVerificationPendind && (
              <PennyVerificationPending
                isOpen={dialogStates.openPennyVerificationPendind}
                handleClick={() => navigate("/kyc/add-bank")}
              />
            )}
            {dialogStates.openInvestError && (
              <InvestError
                isOpen={dialogStates.openInvestError}
                errorMessage={dialogStates.errorMessage}
                handleClick={() => navigate("/invest")}
                close={() => handleDialogStates("openInvestError", false)}
              />
            )}
            {dialogStates.openInvestReferral && (
              <InvestReferralDialog
                isOpen={dialogStates.openInvestReferral}
                proceedInvestment={proceedInvestment}
              />
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default withStyles(styles)(FundDetails);
