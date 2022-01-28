import  React, { useMemo } from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import WVListItem from '../../common/ui/ListItem/WVListItem';
import { navigate as navigateFunc } from '../../utils/functions';
import Container from '../common/Container';
import { ACCOUNT_STATEMENT_OPTIONS } from '../constants';
import cloneDeep from 'lodash/cloneDeep';
import WVInPageHeader from "../../common/ui/InPageHeader/WVInPageHeader";
import WVInPageTitle from "../../common/ui/InPageHeader/WVInPageTitle";
import WVInPageSubtitle from "../../common/ui/InPageHeader/WVInPageSubtitle";
import { getConfig } from "../../utils/functions";
import { handleNativeExit, nativeCallback } from '../../utils/native_callback';

export default function Landing(props) {
  const navigate = navigateFunc.bind(props);
  const { productName, isSdk } = useMemo(() => getConfig(), []);
  const STATEMENT_OPTIONS = cloneDeep(ACCOUNT_STATEMENT_OPTIONS).map(option => {
    delete option.pageProps;
    return option;
  });

  const goToPage = (pageType) => {
    navigate(`/statements/${pageType}`);
  }

  const goBack = () => {
    if (isSdk) {
      nativeCallback({ action: "exit_web"});
    } else {
      handleNativeExit(props, { action: "exit" });
    }
  }

  return (
    <Container
      noFooter
      force_hide_inpage_title
      headerData={{
        goBack
      }}
    >
      <WVInPageHeader
        withImg
        imageProps={{
          src: require(`assets/${productName}/statements_briefcase.svg`),
          style: { width: '95px', height: '52px' }
        }}
      >
        <WVInPageTitle>Statements</WVInPageTitle>
        <WVInPageSubtitle>Overview of your investments</WVInPageSubtitle>
      </WVInPageHeader>
      <WVInfoBubble hasTitle style={{ marginBottom: '30px' }}>
        These statements are not for mutual funds and only reflect your Trading & Demat account transactions
      </WVInfoBubble>
      {STATEMENT_OPTIONS.map(optionObj => {
        return (
          <WVListItem
            key={optionObj.type}
            {...optionObj}
            onClick={() => goToPage(optionObj.type)}
          />
        );
      })}
    </Container>
  );
}