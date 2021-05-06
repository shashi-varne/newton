import React, { useState } from 'react'
import { getConfig } from '../../utils/functions'
import KnowMoreDialog from './KnowMoreDialog'
import { formatAmountInr } from 'utils/validators'
import './mini-components.scss';

const TaxSummaryCard = ({
  open = true,
  handleToggle,
  stcg_tax,
  ltcg_tax,
  stcg_percent,
  ltcg_percent,
  withdrawal_amount,
  friendly_name,
  amc_logo_small,
  exit_load,
  hideIcon = false,
  know_how_msg,
}) => {
  const [showKnowMoreDialog, setShowKnowMoreDialog] = useState(false)
  const closeDialog = () => {
    setShowKnowMoreDialog(false)
  }
  const openDialog = () => {
    setShowKnowMoreDialog(true)
  }
  const productName = getConfig().productName
  return (
    <section className="withdraw-tax-summary">
      <div className="top flex-between-center">
        <div className="flex-center">
          <img className="fund-image" src={amc_logo_small} alt="" />
          <div className="fund-name">{friendly_name}</div>
        </div>
        {open && !hideIcon && (
          <img
            className="icon"
            role="button"
            src={require(`assets/minus_icon.svg`)}
            onClick={handleToggle}
            alt='minus-icon'
          />
        )}
        {!open && !hideIcon && (
          <img
            className="icon"
            role="button"
            src={require(`assets/plus_icon.svg`)}
            onClick={handleToggle}
            alt='plus-icon'
          />
        )}
      </div>
      {open && (
        <div className={!open ? 'item item_hide' : 'item'}>
          <div className="tile flex-between-center">
            <div className="name">Withdraw Amount</div>
            <div className="value">{formatAmountInr(withdrawal_amount)}</div>
          </div>
          <div className="tile flex-between-center">
            <div className="name">Total tax liability</div>
            <div className="value">{formatAmountInr(stcg_tax + ltcg_tax)}</div>
          </div>
          <div className="tile tile2 flex-between-center">
            <div className="name">Equity STCG tax @{stcg_percent}</div>
            <div className="value">{formatAmountInr(stcg_tax)}</div>
          </div>
          <div className="tile tile2 flex-between-center">
            <div className="name">Equity LTCG tax @{ltcg_percent}%</div>
            <div className="value">{formatAmountInr(ltcg_tax)}</div>
          </div>
          <div className="tile flex-between-center">
            <div className="name">Exit load</div>
            <div className="value">{formatAmountInr(exit_load)}</div>
          </div>
        </div>
      )}
      {know_how_msg && (
        <footer className="summary-bottom-info flex-between">
          <div className="flex-center">
            <img
              className="icon"
              src={require(`assets/${productName}/info_icon.svg`)}
              alt=""
            />
            <div className="content">Avoid taxes for better returns!</div>
          </div>
          <div className="tax-summary-know-more" onClick={openDialog}>
            KNOW HOW
          </div>
        </footer>
      )}
      <KnowMoreDialog onClose={closeDialog} open={showKnowMoreDialog} message={know_how_msg} />
    </section>
  )
}

export default TaxSummaryCard
