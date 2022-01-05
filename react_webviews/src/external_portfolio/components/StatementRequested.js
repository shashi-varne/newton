import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../common/ui/Button';
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement';
import WVInPageSubtitle from '../../common/ui/InPageHeader/WVInPageSubtitle';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import { getConfig, navigate as navigateFunc } from '../../utils/functions';
import { nativeCallback } from '../../utils/native_callback';
import { getUrlParams, storageService } from '../../utils/validators';
import { fetchEmails, requestStatement } from '../common/ApiCalls';
import Container from '../common/Container';
import ActionStatus from '../mini-components/ActionStatus';
import InfoBox from '../mini-components/InfoBox';
import toast from '../../common/ui/Toast';
import StatementRequestStep from '../mini-components/StatementRequestStep';
import { regenTimeLimit } from '../constants';
import { navigate as navigateFunc, setPlatformAndUser } from '../common/commonFunctions';

const { productName, emailDomain } = getConfig();

export default function StatementRequested(props) {
  const params = props.location?.params || {};

  const getEmailParam = () => {
    const matchParams = props.match.params || {};
    const queryParams = getUrlParams();
    const emailParam = matchParams.email || queryParams.email;
    return emailParam;
  }

  const cameFromApp = () => {
    // TODO: Use usememo
    // const params = this.props.location.params || {};
    console.log(props);
    const urlParams = getUrlParams() || {};
    const trueVals = [true, 'true'];

    return trueVals.includes(params.fromApp) || trueVals.includes(urlParams.fromApp);
  }

  const navigate = useCallback((path, ...params) => {
    const navigator = navigateFunc.bind(props);
    return navigator(`/hni/${path}`, ...params);
  }, []);

  const [state, setState] = useState({
    popupOpen: false,
    show_loader: false,
    loadingText: '',
    email_detail: '',
    selectedEmail: getEmailParam(),
    exitToApp: params.exitToApp || cameFromApp(),
    entry_point: ''
  });
  const showBack = cameFromApp() || params.comingFrom === 'settings';

  useEffect(() => {
    setPlatformAndUser();
    initialisePageData();
  }, []);

  const initialisePageData = async () => {
    setEntryPoint();

    const emailParam = getEmailParam();
    console.log(emailParam);
    if (emailParam) {
      setState({ selectedEmail: emailParam });
      try {
        const [email] = await fetchEmails({ email_id: emailParam });
        if (email) {
          let showFooterBtn = false;
          if (email.latest_statement) {
            showFooterBtn =
              (new Date() - new Date(email.latest_statement.dt_updated)) / 60000 >= regenTimeLimit;
          }
          setState({
            email_detail: email || {},
            showFooterBtn,
          });
          storageService().setObject('email_detail_hni', email);
        }
      } catch (err) {
        console.log(err);
        toast(err);
      }
    }
  }

  const setEntryPoint = () => {
    // const params = props.location.params || {};
    let entry_point = '';
    if (cameFromApp()) entry_point = 'app';
    else if (params.fromRegenerate) entry_point = 'regenerate_stat';
    else if (params.fromResync) entry_point = 'resync';
    else entry_point = 'email_entry';

    setState({ entry_point });
  }

  const sendEvents = (user_action) => {
    // const params = props.location.params || {};
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'statement request sent',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
        email_look_clicked: params.comingFrom === 'email_example_view',
        entry_point: state.entry_point || null,
        status: state.showFooterBtn ? 'mail not recieved in 30 min' : 'before tracker setup',
      }
    };

    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }


  const generateStatement = () => {
    sendEvents('regenerate_stat');
    setState({ popupOpen: true });
  }

  const onPopupClose = () => {
    setState({ popupOpen: false });
  }

  const onInfoCtrlClick = () => {
    sendEvents('email_change');
    // const params = this.props.location.params || {};

    navigate('email_entry', {
      comingFrom: 'statement_request',
      fromRegenerate: params.fromRegenerate,
      navigateBackTo: params.navigateBackTo,
      exitToApp: state.exitToApp,
      fromApp: cameFromApp(),
      email: state.selectedEmail,
    });
  }

  const goNext = () => {
    sendEvents('generate_statement');
    // const params = this.props.location.params || {};
    
  }

  const goBack = (params) => {
    storageService().remove('email_detail_hni');
    if (!params || state.exitToApp) {
      nativeCallback({ action: 'exit', events: sendEvents('back') });
    } else if (params.navigateBackTo) { // available when coming from email_entry
      nativeCallback({ events: sendEvents('back') });
      navigate(params.navigateBackTo);
    }
  }

  const emailLinkClick = (params) => {
    setState({ emailLinkClicked: true });
    navigate('email_example_view', {
      /* Require these params to be sent back here, otherwise props
      will be lost when coming back from next page*/
      comingFrom: 'statement_request',
      fromRegenerate: params.fromRegenerate,
      exitToApp: state.exitToApp,
      navigateBackTo: state.exitToApp ? null : params.navigateBackTo,
      noEmailChange: params.noEmailChange,
      fromApp: cameFromApp(),
      email: state.selectedEmail,
      statementSource: state?.email_detail?.latest_statement?.statement_source
    });
  }

  return (
    <Container
      hideInPageTitle={true}
      goBack={goBack}
      showLoader={state.show_loader}
      loaderData={{
        loadingText: state.loadingText,
      }}
      noFooter={!state.showFooterBtn}
      buttonTitle="did not recieve email"
      headerData={{ icon: showBack ? 'back' : 'close' }}
      handleClick={goNext}
    >
      <div className="statement-requested-header">
        <div>
          <WVInPageTitle>
            Get started with portfolio tracking
          </WVInPageTitle>
          <WVInPageSubtitle>
            Get a consolidated view of all your external investments
          </WVInPageSubtitle>
        </div>
        <img
          src={require(`assets/${productName}/statements_briefcase.svg`)}
          alt="statement requested"
        />
      </div>
      <div id='ext-pf-statement-requested'>
        <StatementRequestStep stepNumber={1} isCompleted>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <StatementRequestStep.Title>
                Email address
              </StatementRequestStep.Title>
              <StatementRequestStep.Content>
                {state.selectedEmail}
              </StatementRequestStep.Content>
            </div>
            <WVClickableTextElement onClick={onInfoCtrlClick}>
              EDIT
            </WVClickableTextElement>
          </div>
        </StatementRequestStep>
        <StatementRequestStep stepNumber={2} isCompleted>
          <StatementRequestStep.Title>
            Portfolio statement requested
          </StatementRequestStep.Title>
          <StatementRequestStep.Content>
            You will recieve an email with your consolidated portfolio statement
          </StatementRequestStep.Content>
          <div id='epsr-statement-pwd'>STATEMENT PASSWORD - <span>{`${productName}123`}</span></div>
          <WVClickableTextElement style={{ marginTop: '12px' }} onClick={emailLinkClick}>
            View Email Sample
          </WVClickableTextElement>
        </StatementRequestStep>
        <StatementRequestStep stepNumber={3}>
          <ActionStatus type="error">
            INVALID CAS
          </ActionStatus>
          <StatementRequestStep.Title>
            Forward CAS
          </StatementRequestStep.Title>
          <StatementRequestStep.Content>
            The email you sent could not be processed. Please ensure you forward the email as received to
            <span id="epsr-forward-email">&nbsp;cas@finity.in</span>
          </StatementRequestStep.Content>
          <Button
            variant="outlined"
            buttonTitle="Regenerate statement"
            color="primary"
            fullWidth
            style={{ marginTop: '10px' }}
            onClick={generateStatement}
          />
        </StatementRequestStep>
        <StatementRequestStep stepNumber={3}>
          <ActionStatus type="warning">
            PENDING ON YOU
          </ActionStatus>
          <StatementRequestStep.Title>
            Forward email to
          </StatementRequestStep.Title>
          <InfoBox
            classes={{ root: `info-box-cut-out` }}
            isCopiable={true}
            textToCopy={`cas@${emailDomain}`}
            // boxStyle={boxStyle}
          >
            <span className="info-box-body-text">
              cas@{emailDomain}
            </span>
          </InfoBox>
          <div id="epsr-check-inbox-text">Check your inbox for the email</div>
        </StatementRequestStep>
      </div>
    </Container>
  );
}