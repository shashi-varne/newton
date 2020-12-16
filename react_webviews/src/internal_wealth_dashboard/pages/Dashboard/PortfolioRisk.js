import React, { useEffect, useState } from 'react';
import IwdCard from '../../mini-components/IwdCard';
import { IconButton } from 'material-ui';
import ChevronRight from '@material-ui/icons/ChevronRight';
import toast from '../../../common/ui/Toast';
import IwdCommonPageFooter from '../../mini-components/IwdCommonPageFooter';
import { getBlog, getNewsletter, getPortfolioRisk } from '../../common/ApiCalls';
import { getConfig } from 'utils/functions';
import { formattedDate, isEmpty } from '../../../utils/validators';

const isMobileView = getConfig().isMobileDevice;

const RiskProfile = () => {
  const [riskData, setRiskData] = useState({});
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);
  const [riskError, setRiskError] = useState(false);
  const [blogData, setBlogData] = useState({});
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [blogError, setBlogError] = useState(false);

  useEffect(() => {
    fetchPortfolioRisk();
    fetchBlog();
  }, []);

  const fetchPortfolioRisk = async () => {
    try {
      setIsLoadingRisk(true);
      setRiskError(false);
      const data = await getPortfolioRisk({ date_range: 'one_year' });
      setRiskData(data);
      console.log(data);
    } catch (e) {
      console.log(e);
      setRiskError(true);
      toast(e);
    }
    setIsLoadingRisk(false);
  };

  const fetchBlog = async () => {
    try {
      setIsLoadingBlog(true);
      setBlogError(false);
      const { articles } = await getNewsletter();
      setBlogData(articles[0]);
      console.log(articles);
    } catch (e) {
      console.log(e);
      setBlogError(true);
      toast(e);
    }
    setIsLoadingBlog(false);
  };

  const openArticle = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <IwdCard
        id='iwd-d-risk'
        headerText='Risk analysis'
        error={isEmpty(riskData) || riskError}
        errorText='Something went wrong! Please retry after some time or contact your wealth manager'
        isLoading={isLoadingRisk}
      >
        <div id='iwd-dr-data'>
          <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
            <div className='iwd-drb-label'>Return</div>
            <div className='iwd-drb-value'>{riskData.return}%</div>
          </div>
          <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom border-right' : ''}`}>
            <div className='iwd-drb-label'>Alpha</div>
            <div className='iwd-drb-value'>{riskData.alpha}%</div>
          </div>
          <div className={`iwd-dr-box ${!isMobileView ? 'border-bottom' : ''}`}>
            <div className='iwd-drb-label'>Volatility</div>
            <div className='iwd-drb-value'>{riskData.std_dev}%</div>
          </div>
          <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
            <div className='iwd-drb-label'>Beta</div>
            <div className='iwd-drb-value'>{riskData.beta}</div>
          </div>
          <div className={`iwd-dr-box ${!isMobileView ? 'border-right' : ''}`}>
            <div className='iwd-drb-label'>Sharpe Ratio</div>
            <div className='iwd-drb-value'>{riskData.sharpe_ratio}</div>
          </div>
          <div className='iwd-dr-box'>
            <div className='iwd-drb-label'>Information Ratio</div>
            <div className='iwd-drb-value'>{riskData.information_ratio}</div>
          </div>
        </div>
      </IwdCard>
      <IwdCard
        isClickable
        headerText={blogData.title}
        className="iwd-d-newsletter"
        onClick={() => openArticle(blogData.url)}
      >
        <>
          <IconButton className='iwd-dn-btn'>
            <ChevronRight style={{ color: 'white' }} />
          </IconButton>
          <div id='iwd-dn-gist' dangerouslySetInnerHTML={{ '__html': blogData.excerpt }}></div>
          <div id='iwd-dn-issue'>Fisdom Outlook: {blogData.post_date}</div>
        </>
      </IwdCard>
      <IwdCommonPageFooter />
    </>
  );
};

export default RiskProfile;