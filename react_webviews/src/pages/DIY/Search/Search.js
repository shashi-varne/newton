import React, { useState, useCallback, useRef, useMemo } from 'react';
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
  const [searchValue, setSearchValue] = useState('');
  const [fundResult, setFundResult] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showNoFundmessage, setShowNoFundmessage] = useState(false);
  const [hideFundList, setHideFundList] = useState(false);
  const iframe = isIframe();
  const {isMobileDevice, productName} = useMemo(getConfig,[]);
  const searchQueryRef = useRef(null);
  const handleChange = (event) => {
    let value = event.target.value || '';
    setSearchValue(value);
    if (!value) {
      clearData();
    } else if (value.length > 3) {
      setShowErrorMessage(false);
      if(searchQueryRef.current === value) {
        setHideFundList(false);
        if(isEmpty(fundResult)){
          setShowNoFundmessage(true);
        }
      } else {
        setShowLoader(true);
        search(value);
      }
    } else if (value.length < 4) {
      if (!isEmpty(fundResult)) {
        setHideFundList(true);
      }
      setShowErrorMessage(true);
      setShowNoFundmessage(false);
    }
  };

  const searchFunc = async (value) => {
    searchQueryRef.current = value;
    let data = await querySearch(value);
    setShowLoader(false);
    if (data && data.funds) {
      storageService().setObject('diystore_fundsList', data.funds);
      setFundResult(data.funds);
      setHideFundList(false);
      return;
    } else {
      setShowNoFundmessage(true);
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

  const clearData = () => {
    setShowNoFundmessage(false);
    setShowErrorMessage(false);
    setHideFundList(true)
  }

  const clearInputFields = () => {
    setSearchValue('');
    clearData();
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
          <IframeSearch value={searchValue} handleChange={handleChange} />
        ) : (
          <SearchBar
            value={searchValue}
            onChange={handleChange}
            suffix={searchValue ? <Close className='close-icon' /> : ''}
            onSuffixClick={clearInputFields}
            placeholder='Search funds'
            autoFocus
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
          {!showLoader && fundResult && !hideFundList && (
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
            </>
          )}
          {showNoFundmessage && !showLoader && (
            <Typography
              dataAid='diy-message'
              variant='body1'
              color='foundationColors.content.secondary'
              align='center'
            >
              No result found
            </Typography>
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
