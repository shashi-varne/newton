import React, { useState, useCallback } from 'react';
import { getConfig } from 'utils/functions';
import Close from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import IframeSearch from './IframeSearch';
import { storageService } from 'utils/validators';
import debounce from 'lodash/debounce';
import { isIframe } from 'utils/functions';
import isEmpty from 'lodash/isEmpty';
import './Search.scss';
import ContainerWrapper from '../../../designSystem/organisms/ContainerWrapper';
import { querySearch } from '../../../dashboard/Invest/common/api';
import SearchBar from '../../../designSystem/molecules/SearchBar';
import ProductItem from '../../../designSystem/molecules/ProductItem';
import { Box } from '@mui/material';
import Typography from '../../../designSystem/atoms/Typography';

const Search = (props) => {
  const [value, setValue] = useState('');
  const [fundResult, setFundResult] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showNoFundmessage, setShowNoFundmessage] = useState(false);
  const iframe = isIframe();
  const isMobileDevice = getConfig().isMobileDevice;
  const productName = getConfig().productName;

  const handleChange = (event) => {
    let value = event.target.value || '';
    setValue(value);
    if (!value) setShowErrorMessage(false);
    else if (value.length > 3) {
      setShowLoader(true);
      setShowErrorMessage(false);
      if (!showNoFundmessage) setShowNoFundmessage(true);
      search(value);
    } else if (value.length < 4) {
      if (!isEmpty(fundResult)) {
        setFundResult([]);
      }
      setShowErrorMessage(true);
      setShowNoFundmessage(false);
    }
  };

  const searchFunc = async (value) => {
    let data = await querySearch(value);
    setShowLoader(false);
    if (data && data.funds) {
      storageService().setObject('diystore_fundsList', data.funds);
      setFundResult(data.funds);
      return;
    } else {
      setFundResult([]);
    }
  };

  const search = useCallback(
    debounce((value) => {
      searchFunc(value);
    }, 1500),
    []
  );

  const showFundInfo = (data) => () => {
    let dataCopy = Object.assign({}, data);
    dataCopy.diy_type = 'categories';
    storageService().setObject('diystore_fundInfo', dataCopy);
    props.history.push({
      pathname: '/fund-details-v2',
      search: `${getConfig().searchParams}&isins=${data.isin}&type=diy`,
    });
  };

  const clearInputFields = () => {
    setValue('');
    setShowNoFundmessage(false);
    setShowErrorMessage(false);
    setFundResult([]);
  };

  return (
    <ContainerWrapper
      noFooter
      headerProps={{
        headerTitle: iframe && isMobileDevice ? 'Where do you want to invest?' : '',
      }}
      title={iframe && isMobileDevice ? 'Where do you want to invest?' : ''}
      dataAid='diy-search-screen'
      className='diy-search-wrapper'
      noPadding
    >
      <div className={`diy-search ${isMobileDevice ? 'diy-search-mob' : ''}`} data-aid='diy-search'>
        {iframe || (getConfig().code === 'moneycontrol' && !getConfig().Web) ? (
          <IframeSearch value={value} handleChange={handleChange} />
        ) : (
          <SearchBar
            value={value}
            onChange={handleChange}
            suffix={value ? <Close className='close-icon' /> : ''}
            onSuffixClick={clearInputFields}
            placeholder='Search funds'
          />
        )}
        <Box sx={{ px: 2, pb: 2 }}>
          {showErrorMessage && (
            <Typography
              dataAid='error-message'
              variant='body1'
              color='foundationColors.secondary.lossRed.400'
            >
              Minimum 4 characters required
            </Typography>
          )}
          {showLoader && (
            <div className='search-loader'>
              <CircularProgress size={22} thickness={4} className='progress-bar' />
            </div>
          )}
          {!showLoader && fundResult && (
            <>
              {fundResult.length !== 0 && (
                <Box className='search-list' data-aid='diy-search-list'>
                  {fundResult.map((fund, index) => {
                    return (
                      <ProductItem
                        key={index}
                        dataAid={`diy-fund-result-${index + 1}`}
                        imgSrc={fund.amc_logo_big}
                        showSeparator
                        onClick={showFundInfo(fund)}
                      >
                        <ProductItem.Title>{fund.legal_name}</ProductItem.Title>
                      </ProductItem>
                    );
                  })}
                </Box>
              )}
              {fundResult.length === 0 && showNoFundmessage && (
                <Typography
                  dataAid='diy-message'
                  variant='body1'
                  color='foundationColors.content.secondary'
                  align='center'
                >
                  No result found
                </Typography>
              )}
            </>
          )}
          {!fundResult && iframe && !isMobileDevice && !showLoader && (
            <div className='diy-iframe-search-content'>
              <img src={require(`assets/${productName}/diy_search_iframe.svg`)} alt='search' />
            </div>
          )}
        </Box>
      </div>
    </ContainerWrapper>
  );
};

export default Search;
