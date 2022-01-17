import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { getStatementStatus, setPlatformAndUser } from '../common/commonFunctions';
import WVButton from '../../common/ui/Button/WVButton';
import WVDisableBodyTouch from '../../common/ui/DisableBodyTouch/WVDisableBodyTouch';
import StatementTriggeredPopUp from '../mini-components/StatementTriggeredPopUp';

const { productName, emailDomain } = getConfig();

export default function StatementRequested(props) {
  const params = useMemo(() => props.location?.params || {}, []);
  const cameFromApp = useMemo(() => {
    const urlParams = getUrlParams() || {};
    const trueVals = [true, 'true'];

    return trueVals.includes(params.fromApp) || trueVals.includes(urlParams.fromApp);
  }, []);
  const emailParam = useMemo(() => {
    const matchParams = props.match?.params || {};
    const queryParams = getUrlParams();
    return matchParams.email || queryParams.email;
  }, []);


  const navigate = useCallback((path, params) => {
    const navigator = navigateFunc.bind(props);
    return navigator(`/hni/${path}`, {
      params
    });
  }, []);

  const [state, setState] = useState({
    popupOpen: false,
    showLoader: false,
    emailDetail: '',
    selectedEmail: emailParam,
    exitToApp: params.exitToApp || cameFromApp,
    entry_point: ''
  });

  const updateState = useCallback((newValues = {}) => {
    setState({
      ...state,
      ...newValues
    })
  }, [state]);

  const showBack = cameFromApp || params.comingFrom === 'settings';

  useEffect(() => {
    setPlatformAndUser();
    initialisePageData();
  }, []);

  const initialisePageData = async () => {
    setEntryPoint();

    if (emailParam) {
      updateState({ selectedEmail: emailParam, showLoader: 'page' });
      try {
        const [email] = await fetchEmails({ email_id: emailParam });
        if (email) {
          let showFooterBtn = false;
          if (email.latest_statement) {
            showFooterBtn =
              (new Date() - new Date(email.latest_statement.dt_updated)) / 60000 >= regenTimeLimit;
          }
          updateState({
            emailDetail: email || {},
            showFooterBtn,
            showLoader: false
          });
          storageService().setObject('email_detail_hni', email);
        }
      } catch (err) {
        console.log(err);
        updateState({ showLoader: false });
        toast(err);
      }
    }
  }

  const setEntryPoint = () => {
    let entry_point = '';
    if (cameFromApp) entry_point = 'app';
    else if (params.fromRegenerate) entry_point = 'regenerate_stat';
    else if (params.fromResync) entry_point = 'resync';
    else entry_point = 'email_entry';

    updateState({ entry_point });
  }

  const sendEvents = useCallback((user_action) => {
    let eventObj = {
      "event_name": 'portfolio_tracker',
      "properties": {
        "user_action": user_action,
        "screen_name": 'statement request sent',
        performed_by: storageService().get('hni-platform') === 'rmapp' ? 'RM' : 'user',
        email_look_clicked: params.comingFrom === 'email_example_view',
        entry_point: state.entry_point || null,
        status: state.showFooterBtn ? 'mail not recieved in 1 hr' : 'before tracker setup',
      }
    };

    if (['just_set_events', 'back'].includes(user_action)) {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  }, [state]);

  const goNext = () => {
    navigate('email_not_received', {
      statementSource: state?.emailDetail?.latest_statement?.statement_source
    });
  }

  const goBack = (params) => {
    storageService().remove('email_detail_hni');
    if (!params || state.exitToApp) {
      nativeCallback({ action: 'exit', events: sendEvents('back') });
    } else if (params.navigateBackTo) { // available when coming from email_entry
      nativeCallback({ events: sendEvents('back') });
      navigate(params.navigateBackTo);
    } else {
      props.history.goBack();
    }
  }

  const RenderStep1 = useMemo(() => {
    const onInfoCtrlClick = () => {
      sendEvents('email_change');
      // const params = this.props.location.params || {};

      navigate('email_entry', {
        comingFrom: 'statement_request',
        fromRegenerate: params.fromRegenerate,
        navigateBackTo: params.navigateBackTo,
        exitToApp: state.exitToApp,
        fromApp: cameFromApp,
        email: state.selectedEmail,
      });
    }

    return (
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
    );
  }, [state]);

  const RenderStep2 = useMemo(() => {
    const emailLinkClick = (params) => {
      updateState({ emailLinkClicked: true });
      navigate('email_example_view', {
        /* Require these params to be sent back here, otherwise props
        will be lost when coming back from next page*/
        comingFrom: 'statement_request',
        fromRegenerate: params.fromRegenerate,
        exitToApp: state.exitToApp,
        navigateBackTo: state.exitToApp ? null : params.navigateBackTo,
        noEmailChange: params.noEmailChange,
        fromApp: cameFromApp,
        email: state.selectedEmail,
        statementSource: state?.emailDetail?.latest_statement?.statement_source
      });
    };

    return (
      <StatementRequestStep stepNumber={2} isCompleted>
        <StatementRequestStep.Title>
          Portfolio statement requested
        </StatementRequestStep.Title>
        <StatementRequestStep.Content>
          You will recieve an email with your consolidated portfolio statement
        </StatementRequestStep.Content>
        <div id='epsr-statement-pwd'>
          STATEMENT PASSWORD -
          <span>
            &nbsp;{state.emailDetail?.latest_statement?.password}
          </span>
        </div>
        <WVClickableTextElement style={{ marginTop: '12px' }} onClick={emailLinkClick}>
          View Email Sample
        </WVClickableTextElement>
      </StatementRequestStep>
    );
  }, [state, cameFromApp]);

  const RenderStep3 = useMemo(() => {
    const { emailDetail } = state;

    const generateStatement = async () => {
      sendEvents('regenerate_stat');
      try {
        updateState({ showLoader: 'button' });
        await requestStatement({
          email: emailDetail.email,
          statement_id: emailDetail.latest_statement.statement_id,
          retrigger: 'true',
        });
        updateState({ openPopup: true });
      } catch (err) {
        updateState({ showLoader: false });
        console.log(err);
        toast(err);
      }
    }

    const onPopupClose = () => {
      updateState({ openPopup: false });
      initialisePageData();
    }

    const statementStatus = getStatementStatus(emailDetail?.latest_statement?.statement_status);

    if (statementStatus === 'failure') {
      return (
        <StatementRequestStep stepNumber={3}>
          <ActionStatus type="error">
            INVALID CAS
          </ActionStatus>
          <StatementRequestStep.Title>
            Forward CAS
          </StatementRequestStep.Title>
          <StatementRequestStep.Content>
            The email you sent could not be processed. Please ensure you forward the email as received to
            <span id="epsr-forward-email">&nbsp;cas@{emailDomain}</span>
          </StatementRequestStep.Content>
          <WVButton
            fullWidth
            contained
            color="secondary"
            showLoader={state.showLoader}
            style={{ marginTop: '10px' }}
            onClick={generateStatement}
          >
            Regenerate statement
          </WVButton>
          <WVDisableBodyTouch disableTouch={state.showLoader} />
          <StatementTriggeredPopUp
            isOpen={state.openPopup}
            onCtaClick={onPopupClose}
          />
        </StatementRequestStep>
      );
    }

    return (
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
        >
          <span className="info-box-body-text">
            cas@{emailDomain}
          </span>
        </InfoBox>
        <div id="epsr-check-inbox-text">Check your inbox for the email</div>
      </StatementRequestStep>
    );
  }, [state]);

  return (
    <Container
      force_hide_inpage_title
      showLoader={state.showLoader}
      noFooter={!state.showFooterBtn}
      buttonTitle="did not recieve email"
      headerData={{
        icon: showBack ? 'back' : 'close',
        goBack
      }}
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
        {RenderStep1}
        {RenderStep2}
        {RenderStep3}
      </div>
    </Container>
  );
}