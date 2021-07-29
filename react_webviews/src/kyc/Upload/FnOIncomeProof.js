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
import { checkDocsPending } from '../common/functions';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import { storageService } from '../../utils/validators';
import { getConfig, isNewIframeDesktopLayout, navigate as navigateFunc } from '../../utils/functions';
import InternalStorage from '../common/InternalStorage';
import { landingEntryPoints } from '../../utils/constants';

const UPLOAD_OPTIONS_MAP = {
  'bank-statement': {
    title: 'Bank statement',
    subtitle: 'Last 6 months',
    nativePickerMethodName: 'open_file',
    supportedFormats: "pdf",
    fileName: "bank-statement",
    api_doc_type: "bank_statement",
  },
  'itr': {
    title: 'Income tax returns',
    subtitle: 'Any ITR copy within the last 2 years',
    nativePickerMethodName: 'open_file',
    supportedFormats: "pdf",
    fileName: "itr",
    api_doc_type: "itr_acknowledgement",
  },
  'salary-slip': {
    title: 'Salary slips',
    subtitle: 'Last 3 months',
    nativePickerMethodName: 'open_file',
    supportedFormats: "pdf",
    fileName: "salary-slip",
    api_doc_type: "payslips",
  },
  
}

const ORElem = (
  <div className="kyc-fno-OR">OR</div>
);

const FnOIncomeProof = (props) => {
  const [selectedFile, setSelectedFile] = useState();
  const [selectedType, setSelectedType] = useState('');
  const [filePassword, setFilePassword] = useState('');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [isApiRunning, setIsApiRunning] = useState(false);
  const navigate = navigateFunc.bind(props);
  const { kyc, isLoading, updateKyc } = useUserKycHook();
  const fromState = props?.location?.state?.fromState;
  const { productName, Web } = getConfig();
  const hideSkipOption = !Web ? (storageService().get("native") && !fromState) : landingEntryPoints.includes(fromState);

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
      const data = {
        doc_password: filePassword || undefined,
        doc_type: UPLOAD_OPTIONS_MAP[selectedType]?.api_doc_type
      };
      setIsApiRunning("button")
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

    if (!Web) {
      if (storageService().get("native") && !fromState) {
        nativeCallback({ action: "exit_web"});
      } else {
        navigate(fromState);
      }
    } else {
      if (landingEntryPoints.includes(fromState)) {
        navigate("/");
      } else {
        const areDocsPending = await checkDocsPending(kyc);
        if (areDocsPending) {
          navigate('/kyc/document-verification');
        } else {
          navigate('/kyc-esign/info');
        }
      }
    }
  }

  const onPasswordChange = (event) => {
    setFilePassword(event.target.value);
  }

  const removeEventData = () => {
    storageService().remove("view_sample_clicked") 
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
      canSkip={!hideSkipOption}
      hidePageTitle
      hideHamburger
      handleClick={uploadAndGoNext}
      onSkipClick={(e) => goNext(e, "skip")}
      title="Provide income proof for F&O trading"
      buttonTitle="Upload"
      disable={!selectedFile}
      showLoader={isApiRunning}
      skelton={isLoading}
    >
      <WVInPageHeader style={{ marginBottom: '15px' }}>
        <WVInPageTitle>Provide income proof for F&O trading 
          {!hideSkipOption && <span className="kyc-fno-header-optional-text"> (Optional)</span>}
          </WVInPageTitle>
      </WVInPageHeader>
      <WVInfoBubble>
        In case of multiple files/images, merge them into a single pdf to upload
      </WVInfoBubble>
      <div className="kyc-fno-income-proof">
        <div className="kyc-fip-title">
          Upload any 1 document
        </div>
        {(!selectedFile || (selectedType === 'bank-statement')) &&
          <WVFileUploadCard
            {...UPLOAD_OPTIONS_MAP['bank-statement']}
            customPickerId="bank-statement-picker"
            onFileSelectComplete={onFileSelectComplete('bank-statement')}
            onFileSelectError={onFileSelectError}
            sizeLimit={10}
            file={selectedFile}
          />
        }
        {!selectedFile && ORElem}
        {(!selectedFile || (selectedType === 'itr')) &&
          <WVFileUploadCard
            {...UPLOAD_OPTIONS_MAP['itr']}
            customPickerId="itr-picker"
            onFileSelectComplete={onFileSelectComplete('itr')}
            onFileSelectError={onFileSelectError}
            sizeLimit={10}
            file={selectedFile}
          />
        }
        {!selectedFile && ORElem}
        {(!selectedFile || (selectedType === 'salary-slip')) &&
          <WVFileUploadCard
            {...UPLOAD_OPTIONS_MAP['salary-slip']}
            customPickerId="salary-slip-picker"
            onFileSelectComplete={onFileSelectComplete('salary-slip')}
            onFileSelectError={onFileSelectError}
            sizeLimit={10}
            file={selectedFile}
          />
        }
        {selectedFile &&
          <TextField
            variant="filled"
            label="Enter password (if any)"
            value={filePassword}
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
        onClose={() => setOpenBottomSheet(false)}
        title="Income proof uploaded"
        subtitle="Great, just one more step to go! Now complete eSign to get investment ready"
        image={require(`assets/${productName}/doc-uploaded.svg`)}
        button1Props={{
          title: 'Continue',
          variant: "contained",
          onClick: goNext
        }}
      />
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
            supportedFormats="pdf"
            fileName={option}
            className="kyc-fi-upload-card"
          />
        ))}
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}