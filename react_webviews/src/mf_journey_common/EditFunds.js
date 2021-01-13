import React from 'react';
import Container from '../fund_details/common/Container';
import { storageService } from 'utils/validators';
import { formatAmountInr } from '../utils/validators';
import replaceFund from "assets/replace_bfdl.png"
import FundCard from './FundCard';
import { navigate as navigateFunc} from './common/commonFunction';
import './style.scss';
const EditFunds = (props) => {
  const {recommendation,alternatives} = storageService().getObject("graphData");
  const navigate = navigateFunc.bind(props);
  const showAlternateFunds = (mfType) => e => {
    navigate("alternate-funds",mfType)
  }
  return (
    <Container
      //goBack={()=>{}}
      classOverRide='pr-error-container'
      fullWidthButton
      buttonTitle='Done'
      helpContact
      hideInPageTitle
      hidePageTitle
      title='Edit Funds'
      // handleClick={retry}
      classOverRideContainer='pr-container'
    >
      <section className='recommendations-common-container-edit'>
        <div className='recommendations-funds-lists-edit'>
          {recommendation?.map(( el, idx ) => (
            <div key={idx} className='recommendations-funds-item-edit'>
              <FundCard  classOverRide="recommendation-edit-replace" fund={el}/>
              <div className='recommendations-funds-item-replace' onClick={showAlternateFunds(el.mftype)}>
                <img alt='replaceFund' src={replaceFund} />
                <div>Replace</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};
export default EditFunds;
