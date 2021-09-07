import  React from 'react';
import WVInfoBubble from '../../common/ui/InfoBubble/WVInfoBubble';
import WVListItem from '../../common/ui/ListItem/WVListItem';
import { navigate as navigateFunc } from '../../utils/functions';
import Container from '../common/Container';
import { ACCOUNT_STATEMENT_OPTIONS } from '../constants';
import cloneDeep from 'lodash/cloneDeep';

export default function Landing(props) {
  const navigate = navigateFunc.bind(props);
  const STATEMENT_OPTIONS = cloneDeep(ACCOUNT_STATEMENT_OPTIONS).map(option => {
    delete option.pageProps;
    return option;
  });

  const goToPage = (pageType) => {
    navigate(`/statements/${pageType}`);
  }

  return (
    <Container
      noFooter
      title="Statements"
      smallTitle="Overview of your investments"
    >
      <WVInfoBubble hasTitle style={{ marginBottom: '30px' }}>
        The statements are not for mutual funds and only reflect your Trading & Demat account transactions
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