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
import { navigate as navigateFunc } from '../common/functions';
import { nativeCallback } from '../../utils/native_callback';
import WVInPageHeader from '../../common/ui/InPageHeader/WVInPageHeader';
import WVInPageTitle from '../../common/ui/InPageHeader/WVInPageTitle';
import { checkDocsPending } from '../services';
import WVBottomSheet from '../../common/ui/BottomSheet/WVBottomSheet';
import { getConfig } from '../../utils/functions';

const { productName } = getConfig();
const UPLOAD_OPTIONS_MAP = {
  'bank-statement': {
    title: 'Bank statement',
    subtitle: 'Last 6 months',
    nativePickerMethodName: 'open_gallery',
    supportedFormats: "pdf",
    fileName: "bank-statement",
    api_doc_type: "bank_statement",
  },
  'itr': {
    title: 'Income tax returns',
    subtitle: 'Any ITR copy within the last 2 years',
    nativePickerMethodName: 'open_gallery',
    supportedFormats: "pdf",
    fileName: "itr",
    api_doc_type: "itr_acknowledgement",
  },
  'salary-slip': {
    title: 'Salary slips',
    subtitle: 'Last 3 months',
    nativePickerMethodName: 'open_gallery',
    supportedFormats: "pdf",
    fileName: "salary-slip",
    api_doc_type: "payslips",
  },
  
}

const OR = (
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

  const uploadDocument = async () => {
    sendEvents("next");
    try {
      const data = {
        doc_password: filePassword || undefined,
        doc_type: UPLOAD_OPTIONS_MAP[selectedType]?.api_doc_type
      };
      setIsApiRunning("button")
      const result = await upload(selectedFile, 'income', data);
      updateKyc(result.kyc);
    } catch (err) {
      console.error(err);
      Toast('Something went wrong! Please try again')
    } finally {
      console.log('uploaded')
      setIsApiRunning(false)
    }
  }

  const goNext = async (skip) => {
    if(skip)
      sendEvents("skip");
    if (!skip) {
      await uploadDocument();
    }
    
    const areDocsPending = checkDocsPending(kyc);
    if (areDocsPending) {
      navigate('/kyc/document-verification');
    } else {
      if (skip) {
        navigate('/kyc-esign/info');
      } else {
        setOpenBottomSheet(true);
      }
    }
  }

  const onPasswordChange = (event) => {
    setFilePassword(event.target.value);
  }

  const sendEvents = (userAction) => {
    let eventObj = {
      event_name: "trading_onboarding",
      properties: {
        user_action: userAction || "",
        screen_name: "provide_income_proof",
        bank_statement: selectedType === "bank-statement" ? "yes" : "no",
      },
    };
    if (userAction === "just_set_events") {
      return eventObj;
    } else {
      nativeCallback({ events: eventObj });
    }
  };

  return (
    <Container
      events={sendEvents("just_set_events")}
      canSkip
      hidePageTitle
      hideHamburger
      handleClick={goNext}
      onSkipClick={() => goNext(true)}
      title="Provide income proof for F&O trading"
      buttonTitle="Upload"
      disable={!selectedFile}
      showLoader={isApiRunning}
      skelton={isLoading}
    >
      <WVInPageHeader>
        <WVInPageTitle>Provide income proof for F&O trading</WVInPageTitle>
        <span className="kyc-fno-header-optional-text"> (Optional)</span>
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
        {!selectedFile && OR}
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
        {!selectedFile && OR}
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
          <WVClickableTextElement onClick={() => navigate('fno-sample-documents')}>
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
          type: 'primary',
          onClick: () => navigate('/kyc-esign/info')
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