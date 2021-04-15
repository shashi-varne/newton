import './style.scss';
import React, { useState } from 'react';
import Container from '../common/Container';
import FundCard from '../invest/mini-components/FundCard';
import Button from '@material-ui/core/Button';
import Dialog, { DialogActions, DialogTitle } from 'material-ui/Dialog';
import replaceFund from 'assets/replace_bfdl.png';
import { navigate as navigateFunc } from '../invest/common/commonFunction';
import isEmpty from 'lodash/isEmpty';
import useFunnelDataHook from '../invest/common/funnelDataHook';

const EditFunds = (props) => {
  const [open, setOpen] = useState(false);
  const { funnelData } = useFunnelDataHook();
  const { recommendation, alternatives } = funnelData;
  const navigate = navigateFunc.bind(props);

  const filterAlternateFunds = (mftype) => {
    // eslint-disable-next-line no-unused-expressions
    recommendation?.forEach((el) => {
      return alternatives[mftype]?.forEach((alt, idx) => {
        if (alt.mf.mfid === el.mf.mfid) {
          // eslint-disable-next-line no-unused-expressions
          alternatives[mftype].splice(idx, 1);
        }
      });
    });
    return alternatives[mftype];
  };

  const showAlternateFunds = ({ amount, mf: { mfid, mftype } }) => (e) => {
    const alternateFunds = filterAlternateFunds(mftype);
    if (isEmpty(alternateFunds)) {
      setOpen(true);
    } else {
      navigate('recommendations/alternate-funds', { mftype, mfid, amount, alternateFunds });
    }
  };

  const goBack = () => {
    props.history.goBack();
  };

  const onClose = () => {
    setOpen(!open);
  };

  return (
    <Container
      classOverRide='pr-error-container'
      buttonTitle='Done'
      title='Edit Funds'
      handleClick={goBack}
      classOverRideContainer='pr-container'
    >
      <section className='recommendations-common-container-edit'>
        <div className='recommendations-funds-lists-edit'>
          {recommendation?.map((el, idx) => (
            <div key={idx} className='recommendations-funds-item-edit'>
              <FundCard classOverRide='recommendation-edit-replace' fund={el} />
              <div className='recommendations-funds-item-replace' onClick={showAlternateFunds(el)}>
                <img alt='replaceFund' src={replaceFund} />
                <div>Replace</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <DialogContainer open={open} onClose={onClose} />
        </div>
      </section>
    </Container>
  );
};
export default EditFunds;

const DialogContainer = ({ open, onClose }) => {
  return (
    <Dialog
      fullScreen={false}
      open={open}
      onClose={onClose}
      aria-labelledby='responsive-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>No alternative funds available</DialogTitle>
      <DialogActions>
        <Button className='DialogButtonFullWidth' onClick={onClose} color='default' autoFocus>
          GOT IT!
        </Button>
      </DialogActions>
    </Dialog>
  );
};
