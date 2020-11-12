import React, { useEffect } from 'react';
import RebalanceFundItem from '../common/RebalanceFundItem';

import { storageService } from 'utils/validators';
const RebalanceFundList = ({ data, onCheck, location }) => {
  console.log('data is ', data);
  const sips = storageService().getObject('sip') || [];
  const corpus = storageService().getObject('corpus') || [];
  const sip_corpus = storageService().getObject('sip_corpus') || [];
  useEffect(() => {
    if (!storageService().getObject('checked_funds').length > 0) {
      storageService().setObject('checked_funds', [...sips, ...corpus, ...sip_corpus]);
    }
  }, []);
  return (
    <div>
      {data?.length > 0 &&
        data.map((el, index) => <RebalanceFundItem key={index} data={el} onCheck={onCheck} />)}
    </div>
  );
};

export default RebalanceFundList;
