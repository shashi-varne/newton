import { handleApi } from '../../../kyc/common/api';

export const fetchfundsInfo = async (Api, investmentType, isins) => {
  const fundOrderData = await Api.get(`api/mf/funddata/${investmentType}?type=isin&isins=${isins}`);
  return handleApi(fundOrderData);
};
