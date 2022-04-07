import React, { useEffect, useState } from 'react';
import WVFileUploadCard from '../../common/ui/FileUploadCard/WVFileUploadCard';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import Container from '../common/Container';
import { Add, Remove } from '@material-ui/icons';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, TextField } from '@material-ui/core';
import WVClickableTextElement from '../../common/ui/ClickableTextElement/WVClickableTextElement';
import Toast from '../../common/ui/Toast';
import useUserKycHook from '../common/hooks/userKycHook';
import { upload } from '../common/api';
import { nativeCallback } from '../../utils/native_callback';
import WVInPageHeader from '../../common/ui/InPageHeader/WVInPageHeader';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import ConfirmBackDialog from "../mini-components/ConfirmBackDialog";
import { storageService } from '../../utils/validators';
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from '../../utils/functions';
import InternalStorage from '../common/InternalStorage';
import { landingEntryPoints } from '../../utils/constants';
import { PATHNAME_MAPPER } from '../constants';
import { validateAocPaymentAndRedirect } from '../Aoc/common/functions';
import { isRetroMfIRUser } from '../common/functions';

const UPLOAD_OPTIONS_MAP = {
  'bank-statement': {
    title: 'Bank statement',
    subtitle: 'Last 6 months',
    nativePickerMethodName: 'open_file',
    supportedFormats: ["pdf"],
    fileName: "bank-statement",
    api_doc_type: "bank_statement",
  },
  'itr': {
    title: 'Income tax returns',
    subtitle: 'Any ITR copy within the last 2 years',
    nativePickerMethodName: 'open_file',
    supportedFormats: ["pdf"],
    fileName: "itr",
    api_doc_type: "itr_acknowledgement",
  },
  'salary-slip': {
    title: 'Salary slips',
    subtitle: 'Last 3 months',
    nativePickerMethodName: 'open_file',
    supportedFormats: ["pdf"],
    fileName: "salary-slip",
    api_doc_type: "payslips",
  },
  
}

const ORElem = (
  <div className="kyc-fno-OR">OR</div>
);

const hideSkipOptionPaths = [...landingEntryPoints, "/my-account", "/kyc/web"]

const FnOIncomeProof = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [selectedType, setSelectedType] = useState('');
  const [filePassword, setFilePassword] = useState('');
  const [filePasswordErr, setFilePasswordErr] = useState('');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const [goBackModal, setGoBackModal] = useState(false);
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const fromState = props?.location?.state?.fromState;
  const goBackPath = props.location?.state?.goBack || "";
  const { productName, Web, isSdk } = getConfig();
  const fromNativeLandingOrMyAccounts = storageService().get("native") && goBackPath === "exit";
  const isFromKycJourney = !((!Web && !isSdk) ? fromNativeLandingOrMyAccounts : hideSkipOptionPaths.includes(fromState));
  const isMyAccountFlow = fromState === "/my-account";
  const fromWebModuleEntry = fromState === "/kyc/web";

  useEffect(() => {
    setFilePassword('');
  }, [selectedFile]);

  const onFileSelectComplete = (type) => (file) => {
    setSelectedType(type);
    setSelectedFile(file);
  }

  const onFileSelectError = () => {
    Toast('Please select a pdf file only');
  }

  const uploadAndGoNext = async () => {
    sendEvents("next");
    try {
      if (filePassword.match(/\s/)) {
        setFilePasswordErr('Password cannot have spaces');
        return;
      }
      const data = {
        doc_password: filePassword,
        doc_type: UPLOAD_OPTIONS_MAP[selectedType]?.api_doc_type
      };
      setIsApiRunning("button");
      const result = await upload(selectedFile, 'income', data);
      updateKyc(result.kyc);
      if(isNewIframeDesktopLayout()) {
        const stateParams = {
          title: "Income proof uploaded",
          buttonTitle: "CONTINUE",
          message: "Great, just one more step to go! Now complete eSign to get investment ready",
          image: "doc-uploaded.svg"
        }
        InternalStorage.setData('handleClick', goNext);
        navigate('/kyc/fno-income-proof-status',{state:{...stateParams}});
      } else {
        setOpenBottomSheet(true);
      }
    } catch (err) {
      console.error(err);
      Toast('Something went wrong! Please try again')
    } finally {
      setIsApiRunning(false)
    }
  }

  const goNext = async (event, skip) => {
    if(skip) {
      sendEvents("skip");
    }
    
    if (!Web && !isSdk) {
      commonNativeNavigation();
    } else {
      if (isMyAccountFlow) {
        navigate("/my-account");
      } else if (landingEntryPoints.includes(fromState) || fromWebModuleEntry) {
        navigate("/");
      } else {
        commonRedirection();
      }
    }
  }

  const commonRedirection = () => {
    if (isRetroMfIRUser(kyc) || productName === "finity") {
      validateAocPaymentAndRedirect(kyc, navigate);
    } else {
      navigate(PATHNAME_MAPPER.aocSelectAccount);
    }
  }
  
  const commonNativeNavigation = () => {
    if (fromNativeLandingOrMyAccounts) {
      nativeCallback({ action: "exit_web"});
    } else {
      commonRedirection();
    }
  }

  const onPasswordChange = (event) => {
    setFilePasswordErr('');
    setFilePassword(event.target.value);
  }

  const removeEventData = () => {
    storageService().remove("view_sample_clicked") 
  }

  const closeConfirmBackDialog = () => {
    setGoBackModal(false);
  };

  const goBackToPath = () => {
    if (fromNativeLandingOrMyAccounts) {
      return nativeCallback({ action: "exit_web"});
    } 

    if(goBackPath && goBackPath !== "exit") {
      navigate(goBackPath)
    } else if (landingEntryPoints.includes(fromState) || fromWebModuleEntry) {
      navigate("/");
    } else {
      navigate(PATHNAME_MAPPER.journey);
    }
  };

  const goBack = () => {
    setGoBackModal(true)
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "provide_income_proof",
        bank_statement: selectedType === "bank-statement" ? "yes" : "no",
        itr: selectedType === "itr" ? "yes" : "no",
        salary_slips: selectedType === "salary-slip" ? "yes" : "no",
        view_sample_documets_clicked: storageService().get("view_sample_clicked") ? "yes" : "no"
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      removeEventData();
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      canSkip={isFromKycJourney}
      hidePageTitle
      hideHamburger
      handleClick={uploadAndGoNext}
      onSkipClick={(e) => goNext(e, "skip")}
      title="Provide income proof for F&O trading"
      buttonTitle="Upload"
      disable={!selectedFile}
      showLoader={isApiRunning}
      skelton={isLoading}
      headerData={{goBack}}
      iframeRightContent={require(`assets/${productName}/kyc_illust.svg`)}
    >
      <WVInPageHeader style={{ marginBottom: '15px' }}>
        <WVInPageTitle>Provide income proof for F&O trading 
          {isFromKycJourney && <span className="kyc-fno-header-optional-text"> (Optional)</span>}
          </WVInPageTitle>
      </WVInPageHeader>
      <WVInfoBubble>
        In case of multiple files/images, merge them into a single pdf to upload
      </WVInfoBubble>
      <div className="kyc-fno-income-proof">
        <div className="kyc-fip-title">
          Upload any 1 document
        </div>
        {Object
          .entries(UPLOAD_OPTIONS_MAP)
          .map((
            [optionKey, optionObj],
            idx,
            arr
          ) => {
            if (!selectedFile || selectedType === optionKey) {
              return (
                <React.Fragment key={idx}>
                  <WVFileUploadCard
                    {...optionObj}
                    customPickerId={`${optionKey}-picker`}
                    onFileSelectComplete={onFileSelectComplete(optionKey)}
                    onFileSelectError={onFileSelectError}
                    sizeLimit={10}
                    file={selectedFile}
                  />
                  {!selectedFile && (idx !== arr.length - 1) && ORElem}
                </React.Fragment>
              );
            }
            return null;
        })}
        {selectedFile &&
          <TextField
            variant="filled"
            label="Enter password (if any)"
            value={filePassword}
            error={!!filePasswordErr}
            helperText={filePasswordErr}
            type="password"
            onChange={onPasswordChange}
            classes={{
              root: 'kyc-fi-file-upload-input'
            }}
          />
        }
        {selectedFile &&
          <OtherOptions
            onFileSelectComplete={onFileSelectComplete}
            onFileSelectError={onFileSelectError}
            selectedOption={selectedType}
          />
        }
        <div className="kyc-fi-sample">
          <WVClickableTextElement onClick={() => {
            storageService().set("view_sample_clicked", true);
            navigate("fno-sample-documents");
          }}>
            VIEW SAMPLE DOCUMENTS
          </WVClickableTextElement>
        </div>
        <img
          src={require('assets/ssl_icon_new.svg')}
          className="kyc-fno-encryption-disclaimer"
          alt="256 SSL SECURE ENCRYPTION"
        />
      </div>
      <WVBottomSheet
        isOpen={openBottomSheet}
        disableEscapeKeyDown
        disableBackdropClick
        onClose={() => setOpenBottomSheet(false)}
        title="Income proof uploaded"
        subtitle={
          isFromKycJourney ?
          "Great, just one more step to go! Now complete eSign to get investment ready" :
          "We will update you when verification has been completed"
        }
        image={require(`assets/${productName}/doc-uploaded.svg`)}
        button1Props={{
          title: isFromKycJourney ? 'Continue' : 'Okay',
          variant: "contained",
          onClick: goNext
        }}
        />
        {goBackModal ?
          <ConfirmBackDialog
            isOpen={goBackModal}
            close={closeConfirmBackDialog}
            goBack={goBackToPath}
          />
          : null
        }
    </Container>
  );
}

export default FnOIncomeProof;

const OtherOptions = ({
  selectedOption,
  onFileSelectComplete,
  onFileSelectError
}) => {
  const [optionsToShow, setOptionsToShow] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setOptionsToShow(
      Object.keys(UPLOAD_OPTIONS_MAP).filter(opt => opt !== selectedOption)
    );
  }, [selectedOption]);


  return (
    <ExpansionPanel
      onChange={(_, expanded) => setIsExpanded(expanded)}
      classes={{ root: 'kyc-fi-expand-options'}}
    >
      <ExpansionPanelSummary
        expandIcon={isExpanded ? <Remove /> : <Add />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div>Hide other upload options</div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        {optionsToShow.map(option => (
          <WVFileUploadCard
            key={option}
            {...UPLOAD_OPTIONS_MAP[option]}
            customPickerId={`${option}-picker`}
            onFileSelectComplete={onFileSelectComplete(option)}
            onFileSelectError={onFileSelectError}
            sizeLimit={10}
            className="kyc-fi-upload-card"
          />
        ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}