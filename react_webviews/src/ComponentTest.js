import React, { useState } from 'react';
import Container from './fhc/common/Container';
import { noop } from 'lodash';
import WVBottomSheet from './common/ui/BottomSheet/WVBottomSheet';
import WVButtonLayout from './common/ui/ButtonLayout/WVButtonLayout';
import WVClickableTextElement from './common/ui/ClickableTextElement/WVClickableTextElement';
import { WVFilePickerWrapper } from './common/ui/FileUploadWrapper/WVFilePickerWrapper';
import WVFullscreenDialog from './common/ui/FullscreenDialog/WVFullscreenDialog';
import WVInfoBubble from './common/ui/InfoBubble/WVInfoBubble';
import WVSelect from './common/ui/Select/WVSelect';
import Close from '@material-ui/icons/Close';
import WVButton from './common/ui/Button/WVButton';
import WVInPageTitle from './common/ui/InPageHeader/WVInPageTitle';
import WVInPageHeader from './common/ui/InPageHeader/WVInPageHeader';
import WVInPageSubtitle from './common/ui/InPageHeader/WVInPageSubtitle';

const SELECT_OPTIONS = [{
  v1: 'opt1',
  v2: 'sub1'
}, {
  v1: 'opt2',
  v2: 'sub2'
}, {
  v1: 'opt3',
  v2: 'sub3'
}, {
  v1: 'opt4',
  v2: 'sub4'
}];

export default function ComponentTest() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Container noFooter>
      {/* ------- BottomSheet --------- */}
        {/* <WVBottomSheet
          isOpen={true}
          onClose={noop}
          buttonLayout="horizontal"
          button1Props={{
            type: 'primary', //required
            title: 'Button 1', //required
            onClick: noop,
            classes: {}
          }}
          button2Props={{
            type: 'secondary', //required
            title: 'Button 1', //required
            onClick: noop,
            classes: {}
          }}
          title="Bottomsheet title LARGE TEXT HERERE EXTRA STUFF TO ADD"
          subtitle="Bottomsheet subtitle IS ALSO QUITE big have to a dd more text"
          image={require('assets/generic_error.svg')}
          // classes={}
        >
          
        </WVBottomSheet> */}
      {/* -------------------------- */}
      {/* ------- ButtonLayout --------- */}
        
      {/* -------------------------- */}
      {/* ------- ClickableElement --------- */}
          {/* <WVClickableTextElement
            onClick={noop}
            // color="primary"
            color="#4F4D00"
          >know more</WVClickableTextElement> */}
      {/* -------------------------- */}
      {/* ------- ClickableElement --------- */}
          {/* <WVFilePickerWrapper
            nativePickerMethodName="open_gallery"
            customPickerId="my-file-picker"
            // showOptionsDialog
            onFileSelectComplete={(f, f64) => console.log('file selected: ', f, f64)}
            onFileSelectError={(err) => console.log('file error: ', err)}
            extraValidation={noop}
            sizeLimit={0.1}
            supportedFormats={['jpeg', 'png']}
            fileName="new file"
            // fileHandlerParams={{}}
          >
            <WVClickableTextElement>Click Me</WVClickableTextElement>
          </WVFilePickerWrapper> */}
      {/* -------------------------- */}
      {/* ------- ClickableElement --------- */}
          <WVFullscreenDialog open={true} onClose={noop}>
            <WVFullscreenDialog.Content onCloseClick={noop}>
              Add any body content here
            </WVFullscreenDialog.Content>
            <WVFullscreenDialog.Action>
              <span>Add any footer content here</span>
            </WVFullscreenDialog.Action>
          </WVFullscreenDialog>
      {/* -------------------------- */}
      {/* ------- InfoBubble --------- */}
          {/* <WVInfoBubble
            hasTitle
            dataAidSuffix="eqkyc"
            // customTitle="Custom Title"
            type="warning"
            isDismissable={false}
            onDismissClick={() => setIsOpen(false)}
            isOpen={isOpen}
          >
            Add any content here. Content breaks into new lines and has no issues with spacing.
          </WVInfoBubble> */}
      {/* -------------------------- */}
      {/* ------- Select --------- */}
          {/* <WVSelect
            preselectFirst
            options={SELECT_OPTIONS} //***required***
            indexBy="v2" //***required***
            titleProp="v1"
            subtitleProp="v2"
            onChange={noop}
            renderItem={SelectItem}
          /> */}
      {/* -------------------------- */}
    </Container>
  );
}

const SelectItem = (item, idx) => {
  return (
    <>
      <WVSelect.ItemTitle dataAidSuffix="eqkyc">{item.v1}</WVSelect.ItemTitle>
      Hello
      <WVSelect.ItemSubtitle>{item.v1}</WVSelect.ItemSubtitle>
    </>
  );
}